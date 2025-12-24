export const COBLOSIN_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138"; 
export const COBLOSIN_ABI = [
    [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "daftarKandidat",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nama",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "hashProfil",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "jumlahSuara",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "dataPemilih",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isTerverifikasi",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "sudahMemilih",
				"type": "bool"
			},
			{
				"internalType": "bytes32",
				"name": "voteReceipt",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "faseSaatIni",
		"outputs": [
			{
				"internalType": "enum CoblosIn.FasePemilihan",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum CoblosIn.FasePemilihan",
				"name": "_faseBaru",
				"type": "uint8"
			}
		],
		"name": "gantiFase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getJumlahKandidat",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "panitia",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_idKandidat",
				"type": "uint256"
			}
		],
		"name": "pilihKandidat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_nama",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "_hashProfil",
				"type": "bytes32"
			}
		],
		"name": "tambahKandidat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSuara",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_pemilih",
				"type": "address"
			}
		],
		"name": "verifikasiPemilih",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
];     