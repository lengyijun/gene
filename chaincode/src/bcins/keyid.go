package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type KeyId struct {
	Key string `json:"symmetricKeyId"`
}

func GetKeyId(fileId string) (string, error) {
	resp, err := http.Get("http://129.28.54.225:8000/fileId2KeyId/?fileId=" + fileId)
	if err != nil {
		return "", nil
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", nil
	}
	// fmt.Printf("%s\n", body)

	// j := []byte(`{"symmetricKeyId": "113"}`)
	// if bytes.Equal(j, body) {
	// fmt.Println("Equal")
	// } else {
	// fmt.Println("Not Equal")
	// }

	data := KeyId{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Println(err.Error())
		return "", nil
	}
	return data.Key, nil
}
