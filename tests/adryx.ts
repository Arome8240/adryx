import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Adryx } from "../target/types/adryx";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("adryx", () => {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Adryx as Program<Adryx>;
  
  // Test accounts
  const authority = provider.wallet as anchor.Wallet;
  const advertiser = Keypair.generate();
  const publisher = Keypair.generate();
  
  // PDAs
  let platformPda: PublicKey;
  let treasuryPda: PublicKey;
  let campaignEscrowPda: PublicKey;
  let publisherEarningsPda: PublicKey;
  
  const campaignId = "test-campaign-001";
  const feePercentage = 500; // 5%

  before(async () => {
    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(
      advertiser.publicKey,
      10 * LAMPORTS_PER_SOL
    );
    
    await provider.connection.requestAirdrop(
      publisher.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    
    // Wait for airdrops
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Derive PDAs
    [platformPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );

    [campaignEscrowPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        advertiser.publicKey.toBuffer(),
        Buffer.from(campaignId)
      ],
      program.programId
    );

    [publisherEarningsPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("publisher"),
        publisher.publicKey.toBuffer()
      ],
      program.programId
    );
  });

  it("Initializes the platform", async () => {
    const tx = await program.methods
      .initialize(feePercentage)
      .accounts({
        platform: platformPda,
        treasury: treasuryPda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize transaction:", tx);

    // Fetch and verify platform account
    const platformAccount = await program.account.platform.fetch(platformPda);
    assert.equal(platformAccount.feePercentage, feePercentage);
    assert.equal(platformAccount.authority.toString(), authority.publicKey.toString());
    assert.equal(platformAccount.totalCampaigns.toNumber(), 0);
  });

  it("Creates a campaign escrow", async () => {
    const initialAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);

    const tx = await program.methods
      .createCampaignEscrow(campaignId, initialAmount)
      .accounts({
        campaignEscrow: campaignEscrowPda,
        platform: platformPda,
        advertiser: advertiser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    console.log("Create campaign escrow transaction:", tx);

    // Fetch and verify campaign escrow
    const escrowAccount = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    assert.equal(escrowAccount.campaignId, campaignId);
    assert.equal(escrowAccount.advertiser.toString(), advertiser.publicKey.toString());
    assert.equal(escrowAccount.balance.toNumber(), initialAmount.toNumber());
    assert.equal(escrowAccount.spent.toNumber(), 0);
    assert.equal(escrowAccount.isActive, true);

    // Verify platform stats updated
    const platformAccount = await program.account.platform.fetch(platformPda);
    assert.equal(platformAccount.totalCampaigns.toNumber(), 1);
  });

  it("Funds an existing campaign", async () => {
    const additionalAmount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);
    
    const escrowBefore = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    const balanceBefore = escrowBefore.balance.toNumber();

    const tx = await program.methods
      .fundCampaign(additionalAmount)
      .accounts({
        campaignEscrow: campaignEscrowPda,
        advertiser: advertiser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    console.log("Fund campaign transaction:", tx);

    // Verify balance increased
    const escrowAfter = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    assert.equal(
      escrowAfter.balance.toNumber(),
      balanceBefore + additionalAmount.toNumber()
    );
  });

  it("Pays a publisher", async () => {
    const paymentAmount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);
    
    const escrowBefore = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    const spentBefore = escrowBefore.spent.toNumber();

    const tx = await program.methods
      .payPublisher(paymentAmount)
      .accounts({
        campaignEscrow: campaignEscrowPda,
        publisherEarnings: publisherEarningsPda,
        platform: platformPda,
        treasury: treasuryPda,
        publisher: publisher.publicKey,
        payer: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Pay publisher transaction:", tx);

    // Verify campaign spent increased
    const escrowAfter = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    assert.equal(
      escrowAfter.spent.toNumber(),
      spentBefore + paymentAmount.toNumber()
    );

    // Verify publisher earnings created and updated
    const earningsAccount = await program.account.publisherEarnings.fetch(publisherEarningsPda);
    assert.equal(earningsAccount.publisher.toString(), publisher.publicKey.toString());
    assert.isAbove(earningsAccount.pending.toNumber(), 0);
    assert.equal(earningsAccount.totalClaimed.toNumber(), 0);
  });

  it("Publisher claims earnings", async () => {
    const earningsBefore = await program.account.publisherEarnings.fetch(publisherEarningsPda);
    const pendingBefore = earningsBefore.pending.toNumber();
    
    const publisherBalanceBefore = await provider.connection.getBalance(publisher.publicKey);

    const tx = await program.methods
      .claimEarnings()
      .accounts({
        publisherEarnings: publisherEarningsPda,
        publisher: publisher.publicKey,
      })
      .signers([publisher])
      .rpc();

    console.log("Claim earnings transaction:", tx);

    // Verify earnings claimed
    const earningsAfter = await program.account.publisherEarnings.fetch(publisherEarningsPda);
    assert.equal(earningsAfter.pending.toNumber(), 0);
    assert.equal(earningsAfter.totalClaimed.toNumber(), pendingBefore);

    // Verify publisher received SOL
    const publisherBalanceAfter = await provider.connection.getBalance(publisher.publicKey);
    assert.isAbove(publisherBalanceAfter, publisherBalanceBefore);
  });

  it("Toggles campaign status", async () => {
    const escrowBefore = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    const wasActive = escrowBefore.isActive;

    const tx = await program.methods
      .toggleCampaign()
      .accounts({
        campaignEscrow: campaignEscrowPda,
        advertiser: advertiser.publicKey,
      })
      .signers([advertiser])
      .rpc();

    console.log("Toggle campaign transaction:", tx);

    // Verify status toggled
    const escrowAfter = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    assert.equal(escrowAfter.isActive, !wasActive);
  });

  it("Withdraws campaign funds when paused", async () => {
    const withdrawAmount = new anchor.BN(0.1 * LAMPORTS_PER_SOL);
    
    const escrowBefore = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    const balanceBefore = escrowBefore.balance.toNumber();
    
    const advertiserBalanceBefore = await provider.connection.getBalance(advertiser.publicKey);

    const tx = await program.methods
      .withdrawCampaign(withdrawAmount)
      .accounts({
        campaignEscrow: campaignEscrowPda,
        advertiser: advertiser.publicKey,
      })
      .signers([advertiser])
      .rpc();

    console.log("Withdraw campaign transaction:", tx);

    // Verify escrow balance decreased
    const escrowAfter = await program.account.campaignEscrow.fetch(campaignEscrowPda);
    assert.equal(
      escrowAfter.balance.toNumber(),
      balanceBefore - withdrawAmount.toNumber()
    );

    // Verify advertiser received SOL
    const advertiserBalanceAfter = await provider.connection.getBalance(advertiser.publicKey);
    assert.isAbove(advertiserBalanceAfter, advertiserBalanceBefore);
  });

  it("Fails to pay publisher when campaign is paused", async () => {
    const paymentAmount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .payPublisher(paymentAmount)
        .accounts({
          campaignEscrow: campaignEscrowPda,
          publisherEarnings: publisherEarningsPda,
          platform: platformPda,
          treasury: treasuryPda,
          publisher: publisher.publicKey,
          payer: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.toString(), "CampaignNotActive");
    }
  });

  it("Fails to withdraw when campaign is active", async () => {
    // Toggle back to active
    await program.methods
      .toggleCampaign()
      .accounts({
        campaignEscrow: campaignEscrowPda,
        advertiser: advertiser.publicKey,
      })
      .signers([advertiser])
      .rpc();

    const withdrawAmount = new anchor.BN(0.1 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .withdrawCampaign(withdrawAmount)
        .accounts({
          campaignEscrow: campaignEscrowPda,
          advertiser: advertiser.publicKey,
        })
        .signers([advertiser])
        .rpc();
      
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.toString(), "CampaignNotActive");
    }
  });
});
