import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { AnchorProvider, Wallet, BN } from '@coral-xyz/anchor';
import bs58 from 'bs58';

@Injectable()
export class SolanaService implements OnModuleInit {
  private readonly logger = new Logger(SolanaService.name);
  private connection: Connection;
  private wallet: Wallet;
  private programId: PublicKey;

  // PDAs
  private platformPda: PublicKey;
  private treasuryPda: PublicKey;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Initialize Solana connection
      const rpcUrl =
        this.configService.get<string>('SOLANA_RPC_URL') ||
        'https://api.devnet.solana.com';
      this.connection = new Connection(rpcUrl, 'confirmed');

      // Load wallet from private key
      const privateKeyString =
        this.configService.get<string>('SOLANA_PRIVATE_KEY');
      if (!privateKeyString) {
        this.logger.warn(
          'SOLANA_PRIVATE_KEY not set. Using default keypair for development.',
        );
        // Generate a temporary keypair for development
        const keypair = Keypair.generate();
        this.wallet = new Wallet(keypair);
      } else {
        const privateKey = bs58.decode(privateKeyString);
        const keypair = Keypair.fromSecretKey(privateKey);
        this.wallet = new Wallet(keypair);
      }

      // Initialize program
      const programIdString =
        this.configService.get<string>('SOLANA_PROGRAM_ID') ||
        'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS';
      this.programId = new PublicKey(programIdString);

      // Derive PDAs
      [this.platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        this.programId,
      );

      [this.treasuryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        this.programId,
      );

      this.logger.log('Solana service initialized');
      this.logger.log(`Wallet: ${this.wallet.publicKey.toString()}`);
      this.logger.log(`Program ID: ${this.programId.toString()}`);
    } catch (error) {
      this.logger.error('Failed to initialize Solana service', error);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Wallet {
    return this.wallet;
  }

  getProgramId(): PublicKey {
    return this.programId;
  }

  getPlatformPda(): PublicKey {
    return this.platformPda;
  }

  getTreasuryPda(): PublicKey {
    return this.treasuryPda;
  }

  /**
   * Derive campaign escrow PDA
   */
  deriveCampaignEscrowPda(
    advertiserPubkey: PublicKey,
    campaignId: string,
  ): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('campaign'),
        advertiserPubkey.toBuffer(),
        Buffer.from(campaignId),
      ],
      this.programId,
    );
    return pda;
  }

  /**
   * Derive publisher earnings PDA
   */
  derivePublisherEarningsPda(publisherPubkey: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('publisher'), publisherPubkey.toBuffer()],
      this.programId,
    );
    return pda;
  }

  /**
   * Get account balance
   */
  async getBalance(pubkey: PublicKey): Promise<number> {
    const balance = await this.connection.getBalance(pubkey);
    return balance;
  }

  /**
   * Get campaign escrow account data
   */
  async getCampaignEscrow(pda: PublicKey): Promise<any> {
    try {
      const accountInfo = await this.connection.getAccountInfo(pda);
      if (!accountInfo) {
        return null;
      }
      // Parse account data (would use program.account.campaignEscrow.fetch in production)
      return accountInfo;
    } catch (error) {
      this.logger.error('Failed to fetch campaign escrow', error);
      return null;
    }
  }

  /**
   * Get publisher earnings account data
   */
  async getPublisherEarnings(pda: PublicKey): Promise<any> {
    try {
      const accountInfo = await this.connection.getAccountInfo(pda);
      if (!accountInfo) {
        return null;
      }
      // Parse account data (would use program.account.publisherEarnings.fetch in production)
      return accountInfo;
    } catch (error) {
      this.logger.error('Failed to fetch publisher earnings', error);
      return null;
    }
  }

  /**
   * Send and confirm transaction
   */
  async sendAndConfirmTx(transaction: Transaction): Promise<string> {
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet.payer],
      { commitment: 'confirmed' },
    );

    return signature;
  }

  /**
   * Convert SOL to lamports
   */
  solToLamports(sol: number): BN {
    return new BN(sol * 1_000_000_000);
  }

  /**
   * Convert lamports to SOL
   */
  lamportsToSol(lamports: number | BN): number {
    const amount = typeof lamports === 'number' ? lamports : lamports.toNumber();
    return amount / 1_000_000_000;
  }
}
