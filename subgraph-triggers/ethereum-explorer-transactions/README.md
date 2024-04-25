`npm install -g  ts-proto`
`protoc --plugin="./node_modules/protobuf-as/bin/protoc-gen-as" --ts_proto_out="src/pb/" ./proto/*.proto`