# health-records-hyperledger-fabric-blockchain
Application of Blockchain technology on health records management

Yêu cầu: Hệ điều hành Ubuntu 18.04 trở lên, đã cài đặt NodeJS, docker, docker-
compose, Expo


Bước 1. Cài đặt Hyperledger Fabric và các docker image cần thiết của Fabric:
curl -sSL https://bit.ly/2ysbOFE | bash -s

Bước 3. Tại thư mục health-record-hyperledger-fabric-blockchain/test-
network, thực hiện lệnh ./startHealthRecord.sh để khởi động mạng
Fabric và deploy chaincode.
Bước 4. Tại thư mục health-record-hyperledger-fabric-blockchain/server, lần
lượt thực hiện các lệnh npm install (chỉ thực hiện lần đầu), npm start để
khởi chạy API server.
Bước 5. Tại thư mục health-record-hyperledger-fabric-blockchain/web, lần
lượt thực hiện các lệnh npm install (chỉ thực hiện lần đầu), npm start để
khởi chạy web app.
Bước 6. Tại thư mục health-record-hyperledger-fabric-blockchain/mobile, lần
lượt thực hiện các lệnh npm install (chỉ thực hiện lần đầu), expo start để
khởi chạy server Expo.
Bước 7. Truy cập localhost:8000 để sử dụng web app.
Bước 8. Tải ứng dụng Expo Client và quét mã QR ứng dụng để sử dụng mobile app.
