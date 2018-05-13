package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"fmt"
)

func compare1(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	return shim.Success([]byte(""))
}

func uploadGene(stub shim.ChaincodeStubInterface, args []string) pb.Response {
  fmt.Println(args)
  err:=stub.PutState("allgene",[]byte(args[0]))
  if err != nil {
	return shim.Error(err.Error())
  }
  return shim.Success([]byte("success upload gene"))
}

func listGene(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	result,err:=stub.GetState("allgene")
	if err!=nil{
		return shim.Error(err.Error())
	}
	return shim.Success(result)
}
