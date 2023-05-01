// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


// Secret Key for FROM Wallet Stored Here
const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key array here
  []            
);

// Secret Key for TO Wallet Stored Here
const DEMO_TO_SECRET_KEY = new Uint8Array(
    []
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

    // TWO MAIN WALLETS
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    var to = Keypair.fromSecretKey(DEMO_TO_SECRET_KEY);

    // Get Senders Balance in LAMPORTS
    var senderswalletBalance = await connection.getBalance(
        new PublicKey(from.publicKey)
    );

    // Convert Senders Balance to SOL
    var senderswalletsol = parseInt(senderswalletBalance) / LAMPORTS_PER_SOL;

    // Print Senders Balance in SOL
    console.log(`Senders Wallet Balance is: ${senderswalletsol} SOL`);

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Refresh Senders Balance in LAMPORTS
    senderswalletBalance = await connection.getBalance(
            new PublicKey(from.publicKey)
        );

    //Refresh Senders Balance in SOL
    senderswalletsol = parseInt(senderswalletBalance) / LAMPORTS_PER_SOL;

    // Extracting 50% of SOL of total balance and storing it in a variable
    const senderswallethalved = senderswalletsol * 0.5;
    console.log("Airdrop completed for the Sender account.");
    
    // Printing out Sender's Balance in SOL
    console.log(`Senders Wallet Balance After AirDrop is: ${senderswalletsol} SOL`);

    // Getting Reciever's Wallet Balance in LAMPORTS
    var recieverswalletBalance = await connection.getBalance(
        new PublicKey(to.publicKey)
    );

    // Printing out Reciever's Wallet Balance in SOL
    console.log(`Recievers Wallet Balance is: ${parseInt(recieverswalletBalance) / LAMPORTS_PER_SOL} SOL`);

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });


    // Send money from "from" wallet and into "to" wallet
    console.log("Sending 50% of SOL from FROM Wallet to TO Wallet...")
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: LAMPORTS_PER_SOL * senderswallethalved
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);

    // Refreshing and Printing out Sender's Balance
    senderswalletBalance = await connection.getBalance(
        new PublicKey(from.publicKey)
    );
    senderswalletsol = parseInt(senderswalletBalance) / LAMPORTS_PER_SOL;
    console.log(`Senders Wallet Balance After Transaction is: ${senderswalletsol} SOL`)

    // Refreshed Reciever's Balance
    recieverswalletBalance = await connection.getBalance(
        new PublicKey(to.publicKey)
    );
    console.log(`Recievers Wallet Balance After TRansaction is: ${parseInt(recieverswalletBalance) / LAMPORTS_PER_SOL} SOL`);

}

transferSol();