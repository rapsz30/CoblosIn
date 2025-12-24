// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoblosIn {
    address public panitia;
    
    enum FasePemilihan { SETUP, REGISTRASI, VOTING, SELESAI }
    FasePemilihan public faseSaatIni;

    struct Kandidat {
        uint id;
        string nama;
        bytes32 hashProfil; 
        uint jumlahSuara;
    }

    struct Pemilih {
        bool isTerverifikasi; 
        bool sudahMemilih;    
        bytes32 voteReceipt;  
    }

    Kandidat[] public daftarKandidat;
    mapping(address => Pemilih) public dataPemilih;
    uint public totalSuara;

    modifier onlyPanitia() {
        require(msg.sender == panitia, "Hanya Panitia yang diizinkan");
        _;
    }

    constructor() {
        panitia = msg.sender; // msg.sender adalah alamat deployer [cite: 142]
        faseSaatIni = FasePemilihan.SETUP;
    }

    function tambahKandidat(string memory _nama, bytes32 _hashProfil) public onlyPanitia {
        require(faseSaatIni == FasePemilihan.SETUP, "Hanya bisa di fase SETUP");
        daftarKandidat.push(Kandidat(daftarKandidat.length, _nama, _hashProfil, 0));
    }

    function verifikasiPemilih(address _pemilih) public onlyPanitia {
        dataPemilih[_pemilih].isTerverifikasi = true;
    }

    function gantiFase(FasePemilihan _faseBaru) public onlyPanitia {
        faseSaatIni = _faseBaru;
    }

    function pilihKandidat(uint _idKandidat) public {
        Pemilih storage pemilih = dataPemilih[msg.sender];
        require(faseSaatIni == FasePemilihan.VOTING, "Voting belum dibuka");
        require(pemilih.isTerverifikasi, "Anda tidak terverifikasi");
        require(!pemilih.sudahMemilih, "Anda sudah memilih");
        require(_idKandidat < daftarKandidat.length, "Kandidat tidak valid");

        pemilih.sudahMemilih = true;
        pemilih.voteReceipt = keccak256(abi.encodePacked(msg.sender, _idKandidat, block.timestamp));
        daftarKandidat[_idKandidat].jumlahSuara++;
        totalSuara++;
    }

    function getJumlahKandidat() public view returns (uint) {
        return daftarKandidat.length;
    }
}