package main

import (
	"fmt"
	"testing"

	"github.com/davecgh/go-spew/spew"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func checkInit(t *testing.T, stub *shim.MockStub, args [][]byte) {
	res := stub.MockInit("1", args)
	if res.Status != shim.OK {
		fmt.Println("Init failed", string(res.Message))
		t.FailNow()
	}
}

func checkUploadFile(t *testing.T, stub *shim.MockStub, args [][]byte) {
	args = append([][]byte{[]byte("uploadFile")}, args...)
	res := stub.MockInvoke("1", args)
	if res.Status != shim.OK {
		fmt.Println("Invoke", args, "failed", string(res.Message))

		t.FailNow()
	}
}

func checkListFile(t *testing.T, stub *shim.MockStub, args [][]byte) {
	args = append([][]byte{[]byte("listFile")}, args...)
	res := stub.MockInvoke("1", args)
	if res.Status != shim.OK {
		fmt.Println("Invoke", args, "failed", string(res.Message))

		t.FailNow()
	} else {
		spew.Dump(res)
	}
}

func checkListRequest(t *testing.T, stub *shim.MockStub, args [][]byte) {
	args = append([][]byte{[]byte("listRequest")}, args...)
	res := stub.MockInvoke("1", args)
	if res.Status != shim.OK {
		fmt.Println("Invoke", args, "failed", string(res.Message))

		t.FailNow()
	} else {
		spew.Dump(res)
	}
}

func checkRequestFile(t *testing.T, stub *shim.MockStub, args [][]byte) {
	args = append([][]byte{[]byte("requestFile")}, args...)
	res := stub.MockInvoke("1", args)
	if res.Status != shim.OK {
		fmt.Println("Invoke", args, "failed", string(res.Message))

		t.FailNow()
	}
}

func checkDealRequest(t *testing.T, stub *shim.MockStub, args [][]byte) {
	args = append([][]byte{[]byte("dealRequest")}, args...)
	res := stub.MockInvoke("1", args)
	if res.Status != shim.OK {
		fmt.Println("Invoke", args, "failed", string(res.Message))

		t.FailNow()
	}
}

func TestExample02_Invoke(t *testing.T) {
	scc := new(SimpleChaincode)           //SimpleChaincode是待测试的chaincode中的struct名
	stub := shim.NewMockStub("ex02", scc) //ex02是name，没有用处。
	checkInit(t, stub, [][]byte{})
	checkUploadFile(t, stub, [][]byte{[]byte("085208"), []byte("考研报名表"), []byte("descripton1")})
	checkUploadFile(t, stub, [][]byte{[]byte("085209"), []byte("复试申请表"), []byte("descripton2")})
	checkUploadFile(t, stub, [][]byte{[]byte("085210"), []byte("调剂申请表"), []byte("descripton3")})
	checkListFile(t, stub, [][]byte{})

	checkRequestFile(t, stub, [][]byte{[]byte("999085208"), []byte("085208"), []byte("alice"), []byte("steven"), []byte("mypublickey")})
	checkListRequest(t, stub, [][]byte{[]byte("steven")})
	checkDealRequest(t, stub, [][]byte{[]byte("999085208"), []byte("steven"), []byte("encryptedKey")})
	checkListRequest(t, stub, [][]byte{[]byte("steven")})
}
