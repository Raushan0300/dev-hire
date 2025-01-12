const main = async () => {
  console.log("Deploying contract...");
  console.log("Private key:", process.env.ACCOUNT_PRIVATE_KEY);
  const contractFactory = await ethers.getContractFactory("DevHireBooking");
  const contract = await contractFactory.deploy();
  // await contract.deployed();

  console.log("Contract deployed to:", contract.target);
};

const runMain=async()=>{
  try{
      await main();
      process.exit(0);
  } catch(error){
      console.log(error);
      process.exit(1);
  };
};

runMain();