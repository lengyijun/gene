package main

import (
	"fmt"
	"net/url"
	"testing"

	"github.com/davecgh/go-spew/spew"
)

func TestGetPubKey(t *testing.T) {
	_, err := GetPubKey("ShopOrgMSP")
	if err != nil {
		t.FailNow()
	}
	// fmt.Println(pubKey)
}

func TestGetEncryptedSYM(t *testing.T) {
	pubKey := "-----BEGIN+PUBLIC+KEY-----%5CnMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8k9vWzRWFtyiCVLza%2Fd%2BsITYM%5CnNmCxTBUqcjPm%2BXrG35nLqcuNrK0Bqo4zCjn4MOjopoF0TeP6Kz1ebHE2qR8gyfTC%5CnEYeY4Xx%2FUFal6jWDIR9%2FwSzFLEL%2B2IxIGfKVKPCJZJyCSgYIO3v8w0B0njL0bb9B%5Cn9s1cwoMfDc%2FB1S3DrwIDAQAB%5Cn-----END+PUBLIC+KEY-----"
	_, err := GetEncryptedSYM(pubKey, "113")
	if err != nil {
		t.FailNow()
	}
	// fmt.Println(ss)
}

func TestCombine(t *testing.T) {
	pubKey, err := GetPubKey("ShopOrgMSP")
	if err != nil {
		fmt.Println(err)
		t.FailNow()
	}
	pubKey = url.QueryEscape(pubKey)
	fmt.Println(pubKey)

	encryptedKey, err := GetEncryptedSYM(pubKey, "113")
	if err != nil {
		fmt.Println(err)
		t.FailNow()
	}

	fmt.Println("encryptedKey: ")
	fmt.Println(encryptedKey)

	decryptKey, err := GetDecryptedSYM(pubKey, encryptedKey)
	if err != nil {
		fmt.Println(err)
		t.FailNow()
	}
	spew.Dump(decryptKey)

}
