package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func listContractTypes(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	return shim.Success([]byte(""))
}
