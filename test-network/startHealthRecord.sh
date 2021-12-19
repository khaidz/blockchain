./network.sh down
rm -rf ../server/wallet
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn HRChaincode -ccv 1 -ccl typescript -ccp ../chaincode/