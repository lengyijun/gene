/*
Copyright IBM Corp. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
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

func checkState(t *testing.T, stub *shim.MockStub, name string, value string) {
	bytes := stub.State[name]
	if bytes == nil {
		fmt.Println("State", name, "failed to get value")
		t.FailNow()
	}
	if string(bytes) != value {
		fmt.Println("State value", name, "was not", value, "as expected")
		t.FailNow()
	}
}

func checkQuery(t *testing.T, stub *shim.MockStub) {
	res := stub.MockInvoke("1", [][]byte{[]byte("gene_ls")})
	if res.Status != shim.OK {
		fmt.Println("Query", "failed", string(res.Message))
		t.FailNow()
	}
	if res.Payload == nil {
		fmt.Println("Query", "failed to get value")
		t.FailNow()
	} else {
		a := gene{}
		json.Unmarshal(res.Payload, a)
		fmt.Println("query result in test")
		spew.Dump(a)
	}
}

func checkInvoke(t *testing.T, stub *shim.MockStub, args [][]byte) {
	res := stub.MockInvoke("1", args)
	if res.Status != shim.OK {
		fmt.Println("Invoke failed", string(res.Message))
		t.FailNow()
	} else {
		spew.Dump(res.Payload)
	}
}

func TestExample02_Invoke(t *testing.T) {
	scc := new(SmartContract)
	stub := shim.NewMockStub("ex02", scc)
	checkInit(t, stub, [][]byte{[]byte("init")})

	checkInvoke(t, stub, [][]byte{[]byte("compare_type_1"), []byte("MYUUID1"), []byte("GENE1"), []byte("GENE2")})
	checkInvoke(t, stub, [][]byte{[]byte("compare_type_1"), []byte("MYUUID2"), []byte("GENE3"), []byte("GENE4")})
	checkInvoke(t, stub, [][]byte{[]byte("compare_type_1"), []byte("MYUUID3"), []byte("GENE5"), []byte("GENE6")})
	checkInvoke(t, stub, [][]byte{[]byte("compare_claim_ls")})
	checkInvoke(t, stub, [][]byte{[]byte("diseasecenter_compare_claim_gene_ls")})

	checkInvoke(t, stub, [][]byte{[]byte("diseasecenter_upload_gene"), []byte("MYUUID3"), []byte("GENE7"), []byte("GENE8")})
	checkInvoke(t, stub, [][]byte{[]byte("diseasecenter_compare_claim_gene_ls")})
	checkInvoke(t, stub, [][]byte{[]byte("calculation_ls")})

	checkInvoke(t, stub, [][]byte{[]byte("diseasecenter_upload_gene"), []byte("MYUUID2"), []byte("GENE7"), []byte("GENE8")})
	checkInvoke(t, stub, [][]byte{[]byte("diseasecenter_upload_gene"), []byte("MYUUID1"), []byte("GENE7"), []byte("GENE8")})
	checkInvoke(t, stub, [][]byte{[]byte("diseasecenter_compare_claim_gene_ls")})
	checkInvoke(t, stub, [][]byte{[]byte("calculation_ls")})

	checkInvoke(t, stub, [][]byte{[]byte("calculation_complete"), []byte("MYUUID1")})
	checkInvoke(t, stub, [][]byte{[]byte("calculation_ls")})
	checkInvoke(t, stub, [][]byte{[]byte("calculation_complete"), []byte("MYUUID2")})
	checkInvoke(t, stub, [][]byte{[]byte("calculation_complete"), []byte("MYUUID3")})
	checkInvoke(t, stub, [][]byte{[]byte("calculation_ls")})
}
