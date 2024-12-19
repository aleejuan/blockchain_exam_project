import React, { useState, useEffect } from "react";
import { getContract } from "./utils/contract";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

function App() {
  const [credits, setCredits] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tokens, setTokens] = useState("");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        console.log("Account changed to:", accounts[0]);
        fetchBalance(accounts[0]);
        fetchCredits();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
        fetchBalance(accounts[0]);
        fetchCredits();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const fetchBalance = async (address) => {
    try {
        const contract = await getContract();
        const balance = await contract.getBalance(address);
        console.log("Fetched balance for account:", address, "Balance:", balance.toString());
        setBalance(balance.toString());
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
};


  const fetchCredits = async () => {
    try {
      const contract = await getContract();
      const nextId = await contract.nextId();
      console.log("Next credit ID:", nextId.toString());
      const creditsArray = [];

      for (let i = 0; i < nextId; i++) {
        const credit = await contract.credits(i);
        creditsArray.push(credit);
      }

      console.log("Fetched credits:", creditsArray);
      setCredits(creditsArray);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const createCredit = async () => {
    if (!amount || parseInt(amount) <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
    }
    try {
        console.log("Creating credit with amount:", amount);
        const contract = await getContract();
        const tx = await contract.createCredit(parseInt(amount), {
            gasLimit: 300000,
        });
        console.log("Transaction sent:", tx);
        await tx.wait();
        console.log("Transaction confirmed");
        fetchCredits();
        fetchBalance(account);
        setAmount("");
    } catch (error) {
        console.error("Error creating credit:", error);
        alert("Error creating credit. Please check the console for details.");
    }
};



  const transferTokens = async () => {
    try {
      console.log("Transferring tokens to:", recipient, "Amount:", tokens);
      const contract = await getContract();
      const tx = await contract.transferTokens(recipient, parseInt(tokens), {
        gasLimit: 100000,
      });
      console.log("Transaction sent:", tx);
      await tx.wait();
      console.log("Transaction confirmed");
      fetchBalance(account);
      fetchBalance(recipient);
      setRecipient("");
      setTokens("");
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Carbon Credit Management
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Connected account: {account}
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Balance: {balance} tokens
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <TextField
          type="number"
          label="Credit Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={createCredit}>
          Create Credit
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <TextField
          type="text"
          label="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <TextField
          type="number"
          label="Tokens"
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
        />
        <Button variant="contained" color="secondary" onClick={transferTokens}>
          Transfer Tokens
        </Button>
      </Box>
      <Paper elevation={3} style={{ marginTop: "20px", padding: "20px" }}>
        <Typography variant="h5">Credits</Typography>
        <List>
          {credits.map((credit, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`ID: ${credit.id.toString()} | Owner: ${credit.owner} | Amount: ${credit.amount.toString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
