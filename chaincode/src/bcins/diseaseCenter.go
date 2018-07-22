package main

import (
  "github.com/hyperledger/fabric/core/chaincode/shim"
  pb "github.com/hyperledger/fabric/protos/peer"
  "encoding/json"
)
func listUnpropossedGene (stub shim.ChaincodeStubInterface,args []string) pb.Response{
  if len(args) !=0{
    return shim.Error("incorrect numbre of args , expect 0")
  }
  undoneIterator,err := stub.GetStateByPartialCompositeKey(prefixUndone,[]string{prefixUploadUndone})
  if err!=nil{
    return shim.Error("cannot getParticail state by composite key")
  }
  defer undoneIterator.Close()
  result := []interface{}{}
  for undoneIterator.HasNext(){
    kvResult,err := undoneIterator.Next()
    if err!=nil{
      return shim.Error("cannot get Next")
    }
    undone := struct {
      UserGene          []string
      OfficialGene      []string
      Result            []string
      Done              bool
      UUID              string
    }{}
    err = json.Unmarshal(kvResult.Value,&undone)
    if err!=nil{
      return shim.Error(err.Error())
    }
    _,compositekey,err:= stub.SplitCompositeKey(kvResult.Key)
    if err!=nil{
      return shim.Error(err.Error())
    }

    undone.Done=false
    undone.UUID= compositekey[1]
    result=append(result,undone)
  }
  returnAsByte,err :=json.Marshal(result)
  return shim.Success(returnAsByte)
}

//args[0] UUID
//args[1:] GENE
func calculation_official_gene_upload (stub shim.ChaincodeStubInterface,args []string ) pb.Response{
  UUID := args[0]
  key,err :=stub.CreateCompositeKey(prefixUndone,[]string{prefixUploadUndone,UUID})
  if err!=nil{
    return shim.Error("cannot create composite key")
  }

  value,err := stub.GetState(key)
  if err!=nil{
    return shim.Error(err.Error())
  }
  if value==nil{
    return shim.Error("no such key")
  }

  result := PSIStruct{}
  err = json.Unmarshal(value,&result)
  if err!=nil{
    return shim.Error(err.Error())
  }
  result.OfficialGene=args[1:]

  resultAsByte,err := json.Marshal(result)
  if err!=nil{
    return shim.Error("cannot marshal")
  }

  err = stub.DelState(key)
  if err!=nil{
    return shim.Error(err.Error())
  }

  key,err = stub.CreateCompositeKey(prefixUndone,[]string{prefixUploadDone,UUID})
  if err!=nil{
    return shim.Error(err.Error())
  }

  err = stub.PutState(key,resultAsByte)
  if err!=nil{
    return shim.Error("cannot put state")
  }
  return shim.Success(nil)
}
