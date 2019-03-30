/*
Copyright IBM Corp. 2016 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
const prefixFileDescriptor = "FileDescriptor"
const prefixRequest = "Request"
const prefixEncryptedKey = "Key"

type SimpleChaincode struct {
}

type FileDescriptor struct {
	Id          string
	Name        string
	CreateTime  string
	UpdateTime  string
	Owner       string
	Description string
	Level       int `0(the lowest,all available),1,2,3(the highest,only few people can accesss it)`
}

type Transaction struct {
	CreateTime         string
	Done               bool
	FileId             string
	FileName           string
	Owner              string `the owner of the file`
	ReqId              string
	Requester          string `who request the key of file`
	RequesterPublicKey string `the publicKey of Requester`
	Token              string
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("SmartContract Init")
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	if function == "uploadFile" {
		return t.uploadFile(stub, args)
	} else if function == "listFile" {
		return t.listFile(stub, args)
	} else if function == "requestFile" {
		return t.requestFile(stub, args)
	} else if function == "listResponse" {
		return t.listResponse(stub, args)
	} else if function == "dealRequest" {
		return t.dealRequest(stub, args)
	} else if function == "listRequest" {
		return t.listRequest(stub, args)
	}

	return shim.Error("Invalid invoke function name: " + function + " Expecting \"invoke\" \"query\"")
}

//args[0]: Transaction Id
//args[1]: Owner Id
//args[2]: encrypted Key
func (t *SimpleChaincode) dealRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("dealRequest Invoke")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	IdIndexKey, err := stub.CreateCompositeKey(prefixRequest, []string{args[1], args[0]}) //Owner first, Id second
	if err != nil {
		return shim.Error("Failed to CreateCompositeKey")
	}

	kvResult, err := stub.GetState(IdIndexKey)
	if err != nil {
		return shim.Error("Failed to GetState")
	}

	transaction := Transaction{}
	err = json.Unmarshal(kvResult, &transaction)
	if err != nil {
		return shim.Error(err.Error())
	}
	transaction.Done = true
	transaction.RequesterPublicKey = args[2] //todo: write here?

	tByte, err := json.Marshal(transaction)
	if err != nil {
		return shim.Error("Failed to Marshal FileDescriptor")
	}

	err = stub.PutState(IdIndexKey, []byte(tByte))
	if err != nil {
		return shim.Error("Fail to put state")
	}
	return shim.Success(tByte)

}

//args[0]: ReqId
//args[1]: FileId
//args[2]: RequesterPublicKey
//args[3]: Token
func (t *SimpleChaincode) requestFile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("requestFile Invoke")
	if len(args) != 4 {
		fmt.Println(args)
		return shim.Error("In requestFile. Incorrect number of arguments: " + strconv.Itoa(len(args)) + ". Expecting 4")
	}
	mytime, _ := stub.GetTxTimestamp()
	loc, _ := time.LoadLocation("Asia/Chongqing")

	if !verifyToken(args[3]) {
		return shim.Error("Fail to verify token")
	}

	creatorOrgMsp, err := GetOrg(stub)
	if err != nil {
		return shim.Error(err.Error())
	}

	IdIndexKey, err := stub.CreateCompositeKey(prefixFileDescriptor, []string{args[1]})
	kvResult, err := stub.GetState(IdIndexKey)
	if err != nil {
		return shim.Error("Failed to GetState")
	}

	fileDescriptor := FileDescriptor{}
	err = json.Unmarshal(kvResult, &fileDescriptor)
	if err != nil {
		return shim.Error(err.Error())
	}

	transaction := Transaction{
		CreateTime:         time.Unix(mytime.Seconds, 0).In(loc).Format("2006-01-02 15:04:05"),
		Done:               false,
		FileId:             args[1],
		FileName:           fileDescriptor.Name,
		Owner:              fileDescriptor.Owner,
		ReqId:              args[0],
		Requester:          creatorOrgMsp,
		RequesterPublicKey: args[2],
		Token:              args[3],
	}
	tByte, err := json.Marshal(transaction)
	if err != nil {
		return shim.Error("Failed to Marshal FileDescriptor")
	}
	IdIndexKey, err = stub.CreateCompositeKey(prefixRequest, []string{fileDescriptor.Owner, args[0]}) //Owner first, Id second
	err = stub.PutState(IdIndexKey, []byte(tByte))
	if err != nil {
		return shim.Error("Fail to put state")
	}
	return shim.Success(tByte)
}

func (t *SimpleChaincode) listFile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("listFile Invoke")
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixFileDescriptor, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	results := []interface{}{}
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		fileDescriptor := FileDescriptor{}
		err = json.Unmarshal(kvResult.Value, &fileDescriptor)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, fileDescriptor)
	}

	resultsAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(resultsAsBytes)
}

//other people request my file
func (t *SimpleChaincode) listResponse(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 0 {
		return shim.Error("Incorrect number of arguments. Expecting 0")
	}
	creator, err := GetOrg(stub)
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("listResponse Invoke, creator:" + creator)

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixRequest, []string{creator})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	results := []interface{}{}
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		transaction := Transaction{}
		err = json.Unmarshal(kvResult.Value, &transaction)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, transaction)
	}

	resultsAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("listResponse return " + strconv.Itoa(len(results)) + " transaction")
	return shim.Success(resultsAsBytes)
}

//args[0]: Id
//args[1]: File Name
//args[2]: Description
//args[3]: Level
//ID is a random number,which should be provided by user, cannot be generated by chaincode
func (t *SimpleChaincode) uploadFile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("uploadFile Invoke")
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	mytime, _ := stub.GetTxTimestamp()
	loc, _ := time.LoadLocation("Asia/Chongqing")
	owner, err := GetOrg(stub)
	if err != nil {
		return shim.Error(err.Error())
	}
	level, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error("Cannot parse level " + args[3] + " to int")
	}
	if (level < 0) || (level > 3) {
		return shim.Error("Error level: " + strconv.Itoa(level) + " ! The level should be in 0,1,2,3")
	}

	f := FileDescriptor{
		Id:          args[0],
		Name:        args[1],
		Description: args[2],
		Level:       level,
		Owner:       owner,
		CreateTime:  time.Unix(mytime.Seconds, 0).In(loc).Format("2006-01-02 15:04:05"),
		UpdateTime:  time.Unix(mytime.Seconds, 0).In(loc).Format("2006-01-02 15:04:05"),
	}
	fByte, err := json.Marshal(f)
	if err != nil {
		return shim.Error("Failed to Marshal FileDescriptor")
	}

	IdIndexKey, err := stub.CreateCompositeKey(prefixFileDescriptor, []string{args[0]})
	err = stub.PutState(IdIndexKey, []byte(fByte))
	if err != nil {
		return shim.Error("Fail to put state")
	}
	return shim.Success(fByte)
}

//request other people's file
func (t *SimpleChaincode) listRequest(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 0 {
		return shim.Error("Incorrect number of arguments. Expecting 0")
	}

	creator, err := GetOrg(stub)
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("listRequest Invoke, creator " + creator)

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixRequest, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	results := []interface{}{}
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		transaction := Transaction{}
		err = json.Unmarshal(kvResult.Value, &transaction)
		if err != nil {
			return shim.Error(err.Error())
		}
		if transaction.Requester == creator {
			results = append(results, transaction)
		}

	}

	resultsAsBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(resultsAsBytes)
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

func GetOrg(stub shim.ChaincodeStubInterface) (string, error) {
	creator, err := stub.GetCreator()
	if err != nil {
		return "", err
	}

	creatorStr := string(creator)
	creatorStr = strings.Trim(creatorStr, "\n\u0012\u0013")

	end := strings.Index(creatorStr, "\u0012")
	if end == -1 {
		return "", errors.New("fail to find \u0012 in GetCreator: " + string(creator))
	}
	creatorStr = string(creatorStr[0:end])
	return creatorStr, nil
}

//todo
func verifyToken(token string) bool {
	return true
}
