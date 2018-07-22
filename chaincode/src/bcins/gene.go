package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

//args[0]: UUID
//args[1:]: all gene to compare
//only create a undone struct
func calculation_user_gene_upload (stub shim.ChaincodeStubInterface, args []string) pb.Response {
  UUID := args[0]
  key,err :=stub.CreateCompositeKey(prefixUndone,[]string{prefixUploadUndone,UUID})
  value := PSIStruct{}
  value.UserGene=args[1:]
  value_byte,err :=json.Marshal(value)
  if err!=nil{
    return shim.Error(err.Error())
  }

  err = stub.PutState(key,value_byte)
  if err!=nil{
    return shim.Error(err.Error())
  }
  return shim.Success(value_byte)
}

type gene struct {
	Allgene string
}

func uploadGene(stub shim.ChaincodeStubInterface, args [][]byte) pb.Response {
	if len(args) != 1 {
		fmt.Println(len(args))
		return shim.Error("Invalid argument count.")
	}
	fmt.Println("in uploadGene")

	err := stub.PutState("Allgene", args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func listGene(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	AllgeneByte, err := stub.GetState("Allgene")
	fmt.Println("in listgene")

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(AllgeneByte)
}

//no args need
func listCompareClaims(stub shim.ChaincodeStubInterface,args []string) pb.Response{
  if len(args) !=0{
    return shim.Error("incorrect number of parameter,expect 0")
  }
  undoneIterator,err :=stub.GetStateByPartialCompositeKey(prefixUndone,[]string{})
  defer  undoneIterator.Close()
  if err!=nil{
    return shim.Error("Get Undone Iterator Failed")
  }

  doneIterator ,err := stub.GetStateByPartialCompositeKey(prefixDone,[]string{})
  defer doneIterator.Close()
  if err!=nil{
    return shim.Error("Get Done Iterator Failed")
  }

  result := []interface{}{}

  for undoneIterator.HasNext(){
    kvResult, err := undoneIterator.Next()
    if err != nil {
      return shim.Error(err.Error())
    }
    undone := struct {
      UserGene          []string
      OfficialGene      []string
      Result            []string
      Done              bool
      UUID              string
    }{}
    err =json.Unmarshal(kvResult.Value,&undone)
    _,compositekey,err := stub.SplitCompositeKey(kvResult.Key)
    if err!=nil{
      return shim.Error(err.Error())
    }
    undone.Done=false
    undone.UUID= compositekey[1]
    if err!=nil{
      return shim.Error("cannot unmarshal")
    }
    result = append(result,undone)
  }

  for doneIterator.HasNext() {
    kvResult, err := doneIterator.Next()
    if err!=nil{
      return shim.Error("cannot get next iterator")
    }
    doneStruct := struct {
      UserGene          []string
      OfficialGene      []string
      Result            []string
      Done              bool
      UUID              string
    }{}
    err = json.Unmarshal(kvResult.Value,&doneStruct)
    _,compositekey,err := stub.SplitCompositeKey(kvResult.Key)
    if err!=nil{
      return shim.Error(err.Error())
    }
    doneStruct.UUID= compositekey[1]
    doneStruct.Done=true
    if err != nil{
      return shim.Error("cannot unmarshal done ")
    }

    result = append(result,doneStruct)
  }
  returnAsByte,err := json.Marshal(result)
  if err !=nil{
    return shim.Error("cannot marshal in returnAsByte")
  }
  return shim.Success(returnAsByte)
}
