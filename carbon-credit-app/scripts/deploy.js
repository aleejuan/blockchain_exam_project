const hre = require("hardhat");

async function main() {
  // Получаем фабрику контракта
  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");

  // Разворачиваем контракт
  const carbonCredit = await CarbonCredit.deploy();

  // Ждем завершения транзакции развертывания
  const receipt = await carbonCredit.deploymentTransaction().wait();

  console.log("CarbonCredit deployed to:", carbonCredit.target);
  console.log("Deployment transaction hash:", receipt.transactionHash);
}

// Запуск скрипта
main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
