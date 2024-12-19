import { ethers } from "ethers";
import CarbonCreditABI from "./CarbonCreditABI.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Убедитесь, что это актуальный адрес

export const getContract = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // Получаем Signer для отправки транзакций
    return new ethers.Contract(contractAddress, CarbonCreditABI, signer);
};
