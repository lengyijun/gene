package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"fmt"
	"encoding/json"
	"strings"
)

func compare1(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	allgeneByte,err:=stub.GetState("allgene")
	allgeneString :=string(allgeneByte)
	_,correctGene,err:=stub.SplitCompositeKey(allgeneString)  //gene is string[]
	if err!=nil{
		return shim.Error(err.Error())
	}

	if len(args)!=1 {
		return shim.Error("Invalid argument count.")
	}
	g:=gene{}
	json.Unmarshal([]byte(args[0]),&g)
	allgene:=g.allgene
	toCompareGeneSplit :=strings.Split(allgene,",")
	result:=[]string{}

	L: for _,i := range(toCompareGeneSplit){
		for _,j := range(correctGene){
			if i==j{
				continue L
			}
		}
		result=append(result,i)
	}
	if len(result)>0{
		//a:=struct{result string}{"you may have a high probility of heart disease"}
		//fmt.Println(a.result)
		m,_:=json.Marshal( "you may have a high probility of heart disease" )
		fmt.Println(m)
		return shim.Success(m)
	}else{
		//a:=struct{result string}{"you may have correctly the same gene as most other people, Congratulations"}
		//fmt.Println(a.result)
		//m,_:=json.Marshal(a)
		m,_:=json.Marshal( "you may have a high probility of heart disease" )
		fmt.Println(m)
		return shim.Success(m)
	}
	//mm,err:=json.Marshal(result)
	//if err!=nil{
	//	return shim.Error(err.Error())
	//}
}

type gene struct {
allgene string
}

func uploadGene(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args)!=1 {
		return shim.Error("Invalid argument count.")
	}
  g:=gene{}
  json.Unmarshal([]byte(args[0]),&g)
  allgene:=g.allgene
  geneSplit :=strings.Split(allgene,",")
  geneCompositeValue,err:=stub.CreateCompositeKey("gene",geneSplit)
  if err!=nil{
  	return shim.Error(err.Error())
  }
  err=stub.PutState("allgene",[]byte(geneCompositeValue))
  if err!=nil{
  	return shim.Error(err.Error())
  }
  return shim.Success(nil)
}

func listGene(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	allgeneByte,err:=stub.GetState("allgene")
	allgeneString :=string(allgeneByte)
	_,gene,err:=stub.SplitCompositeKey(allgeneString)
	if err!=nil{
		return shim.Error(err.Error())
	}
	returndata,err:=json.Marshal(gene)
	if err!=nil{
		return shim.Error(err.Error())
	}
	return shim.Success(returndata)
}
