package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type PublicKey struct {
	Key string `json:"publicKey"`
}

func GetPubKey(orgName string) (string, error) {
	url := "http://129.28.54.225:8000/rsa/?name=" + orgName
	fmt.Println(url)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	fmt.Printf("%s\n", body)

	data := PublicKey{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Println(err.Error())
		return "", err
	}
	return data.Key, nil
}
