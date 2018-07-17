package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func compare1(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// spew.Dump(args)
	g := gene{}
	AllgeneByte, err := stub.GetState("Allgene")
	json.Unmarshal(AllgeneByte, &g)
	fmt.Println("in compare1 , getstate")
	AllgeneString := string(g.Allgene)
	correctGene := strings.Split(AllgeneString, ",")
	if err != nil {
		return shim.Error(err.Error())
	}

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}
	json.Unmarshal([]byte(args[0]), &g)
	Allgene := g.Allgene
	toCompareGeneSplit := strings.Split(Allgene, ",")
	result := []string{}

L:
	for _, i := range toCompareGeneSplit {
		for _, j := range correctGene {
			if i == j {
				continue L
			}
		}
		result = append(result, i)
	}
	if len(result) > 0 {
		//a:=struct{result string}{"you may have a high probility of heart disease"}
		//fmt.Println(a.result)
		m, _ := json.Marshal("you may have a high probility of heart disease")
		fmt.Println(m)
		return shim.Success(m)
	} else {
		//a:=struct{result string}{"you may have correctly the same gene as most other people, Congratulations"}
		//fmt.Println(a.result)
		//m,_:=json.Marshal(a)
		m, _ := json.Marshal("you may have a high probility of heart disease")
		fmt.Println(m)
		return shim.Success(m)
	}
	//mm,err:=json.Marshal(result)
	//if err!=nil{
	//	return shim.Error(err.Error())
	//}
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

	// g := gene{}
	// json.Unmarshal(args[0], &g)
	// Allgene := g.Allgene
	// geneSplit := strings.Split(Allgene, ",")
	// // spew.Dump(geneSplit)
	// geneCompositeValue, err := stub.CreateCompositeKey("gene", geneSplit)
	// if err != nil {
	//   return shim.Error(err.Error())
	// }
	// err = stub.PutState("Allgene", []byte(geneCompositeValue))

	err := stub.PutState("Allgene", args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func listGene(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	AllgeneByte, err := stub.GetState("Allgene")
	fmt.Println("in listgene")
	// spew.Dump(AllgeneByte)

	// AllgeneString := string(AllgeneByte)
	// _, gene, err := stub.SplitCompositeKey(AllgeneString)

	if err != nil {
		return shim.Error(err.Error())
	}

	// returndata, err := json.Marshal(gene)
	// if err != nil {
	//   return shim.Error(err.Error())
	// }

	return shim.Success(AllgeneByte)
}
