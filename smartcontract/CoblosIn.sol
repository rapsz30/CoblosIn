// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Project : CoblosIn
No : 3
Kelompok:
- 23523084 Muhammad Hafi Arqodi
- 23523064 Mohamad Rafi Hendryansah
- 23523065 Marsha Aulia Azzahra
- 23523277 Alfonso Fiter Ferdiansyah
*/

contract CoblosIn {
    
    struct Kandidat {
        uint id;
        string nama;
        uint jumlahSuara;
        string hashProfilKandidat;
    }

    struct Pemilih {
        bool isRegistered;
        bool hasVoted;
    }

    mapping(address => Pemilih) public voters;
    
    Kandidat[] public kandidatList;
    
    address public admin;
    uint public waktuMulai;
    uint public waktuSelesai;
    uint public totalSuaraMasuk;

    event VoteSubmitted(address indexed voter, uint timestamp);


    modifier onlyAdmin() {
        require(msg.sender == admin, "Hanya Admin yang boleh akses");
        _;
    }

    modifier duringVoting() {
        require(block.timestamp >= waktuMulai && block.timestamp <= waktuSelesai, "Voting tidak aktif (Belum mulai atau sudah selesai)");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "Anda sudah memberikan suara sebelumnya");
        _;
    }

    modifier isRegisteredModifier() {
        require(voters[msg.sender].isRegistered, "Anda tidak terdaftar sebagai pemilih");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _nama, string memory _hashProfil) public onlyAdmin {
        uint idBaru = kandidatList.length;
        
        kandidatList.push(Kandidat({
            id: idBaru,
            nama: _nama,
            jumlahSuara: 0,
            hashProfilKandidat: _hashProfil
        }));
    }

    function registerVoters(address[] memory _votersAddress) public onlyAdmin {
        for (uint i = 0; i < _votersAddress.length; i++) {
            voters[_votersAddress[i]].isRegistered = true;
            voters[_votersAddress[i]].hasVoted = false;
        }
    }

    function setVotingPeriod(uint _startTime, uint _endTime) public onlyAdmin {
        require(_endTime > _startTime, "Waktu selesai harus lebih besar dari waktu mulai");
        waktuMulai = _startTime;
        waktuSelesai = _endTime;
    }

    function vote(uint _candidateId) public duringVoting isRegisteredModifier hasNotVoted {
        require(_candidateId < kandidatList.length, "ID Kandidat tidak valid");

        kandidatList[_candidateId].jumlahSuara++;
        
        voters[msg.sender].hasVoted = true;
        
        totalSuaraMasuk++;

        emit VoteSubmitted(msg.sender, block.timestamp);
    }

    function getAllCandidates() public view returns (Kandidat[] memory) {
        return kandidatList;
    }

    function getVotingStatus() public view returns (uint) {
        if (block.timestamp < waktuMulai) {
            return 0;
        } else if (block.timestamp >= waktuMulai && block.timestamp <= waktuSelesai) {
            return 1;
        } else {
            return 2;
        }
    }
}