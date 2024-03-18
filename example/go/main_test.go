package main

import (
	"bytes"
	"os"
	"testing"
)

func Test_sample1(t *testing.T) {
	judge(t, `4`+"\n", `101010101`+"\n")
}

func Test_sample2(t *testing.T) {
	judge(t, `1`+"\n", `101`+"\n")
}

func Test_sample3(t *testing.T) {
	judge(t, `10`+"\n", `101010101010101010101`+"\n")
}

func judge(t *testing.T, input, output string) {
	r, w, err := os.Pipe()
	if err != nil {
		t.Fatalf("os.Pipe(): %v", err)
	}

	if n, err := w.Write([]byte(input)); err != nil {
		t.Fatalf("input is %v bytes, but only %v byte written", len(input), n)
	}

	stdin, stdout := os.Stdin, os.Stdout
	os.Stdin, os.Stdout = r, w
	main()
	os.Stdin, os.Stdout = stdin, stdout

	w.Close()
	var buf bytes.Buffer
	if _, err := buf.ReadFrom(r); err != nil {
		t.Fatalf("can't read from reader: %v", err)
	}
	r.Close()

	got := buf.String()
	if got != output {
		t.Errorf("got: %v, want: %v", got, output)
	}
}
