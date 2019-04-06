package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type DecryptKeyId struct {
	Key string `json:"decryptkey"`
}

func GetDecryptedSYM(pubKey string, encryptedKey string) ([]byte, error) {
	url := "http://129.28.54.225:8000/decrypt/?publickey=" + pubKey + "&encryptkey=" + encryptedKey
	// fmt.Println(url)

	resp, err := http.Get(url)
	if err != nil {
		return []byte(""), err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []byte(""), err
	}
	// fmt.Printf("%s\n", body)

	data := DecryptKeyId{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Println(err.Error())
		return []byte(""), err
	}
	fmt.Println(data)
	resultsAsBytes, err := json.Marshal(data)
	if err != nil {
		log.Println(err.Error())
		return []byte(""), err
	}
	return resultsAsBytes, nil
}
