package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

//args[0]       UUID
func completeCalculation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("incorrect number of args ,expect 1")
	}
	UUID := args[0]
	key, err := stub.CreateCompositeKey(prefixUndone, []string{prefixUploadDone, UUID})
	if err != nil {
		return shim.Error("cannot create composite key done")
	}

	value, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}

	mypsi := PSIStruct{}
	err = json.Unmarshal(value, &mypsi)
	if err != nil {
		return shim.Error(err.Error())
	}

	result := []string{}

L:
	for _, i := range mypsi.OfficialGene {
		for _, j := range mypsi.UserGene {
			if i == j {
				continue L
			}
		}
		result = append(result, i)
	}

	mypsi.Result = result
	stub.DelState(key)

	key, err = stub.CreateCompositeKey(prefixDone, []string{prefixUploadDone, UUID})
	if err != nil {
		return shim.Error(err.Error())
	}
	if err != nil {
		return shim.Error("cannot create composite key done")
	}
	mypsiAsByte, err := json.Marshal(mypsi)
	if err != nil {
		return shim.Error(err.Error())
	}
	stub.PutState(key, mypsiAsByte)

	if len(result) > 0 {
		m, _ := json.Marshal("you may have a high probility of heart disease")
		return shim.Success(m)
	} else {
		m, _ := json.Marshal("you may have a high probility of heart disease")
		return shim.Success(m)
	}

}

func listUndoneCalculation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 0 {
		return shim.Error("incorrect number of args , expecting 0")
	}
	undoneIterator, err := stub.GetStateByPartialCompositeKey(prefixUndone, []string{prefixUploadDone})
	defer undoneIterator.Close()

	result := []interface{}{}
	if err != nil {
		return shim.Error("Get Done Iterator Failed")
	}
	for undoneIterator.HasNext() {
		kvResult, err := undoneIterator.Next()
		if err != nil {
			return shim.Error("cannot get next iterator")
		}
		doneStruct := struct {
			UserGene     []string
			OfficialGene []string
			Result       []string
			Done         bool
			UUID         string
			CreateTime   string
			Type         string
		}{}
		err = json.Unmarshal(kvResult.Value, &doneStruct)
		if err != nil {
			return shim.Error(err.Error())
		}
		_, compositekey, err := stub.SplitCompositeKey(kvResult.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		doneStruct.UUID = compositekey[1]
		doneStruct.Done = true
		if err != nil {
			return shim.Error("cannot unmarshal done ")
		}

		result = append(result, doneStruct)
	}
	returnAsByte, err := json.Marshal(result)
	if err != nil {
		return shim.Error("cannot marshal in returnAsByte")
	}
	return shim.Success(returnAsByte)

}
