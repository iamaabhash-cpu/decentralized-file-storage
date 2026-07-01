// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FileStorage {

    uint256 private fileCount = 0;

    struct File {
        uint256 id;
        string cid;
        string fileName;
        address owner;
        uint256 uploadTime;
        bool deleted;
    }

    mapping(uint256 => File) private files;
    mapping(address => uint256[]) private userFiles;
    mapping(uint256 => mapping(address => bool)) private sharedWith;

    event FileUploaded(
        uint256 indexed fileId,
        address indexed owner,
        string cid,
        string fileName,
        uint256 uploadTime
    );

    event FileRenamed(
        uint256 indexed fileId,
        string newFileName
    );

    event FileDeleted(
        uint256 indexed fileId
    );

    event FileShared(
        uint256 indexed fileId,
        address indexed sharedUser
    );

    event AccessRevoked(
        uint256 indexed fileId,
        address indexed user
    );

    modifier onlyOwner(uint256 _fileId) {
        require(files[_fileId].owner == msg.sender, "Not the owner");
        _;
    }

    function uploadFile(
        string memory _cid,
        string memory _fileName
    ) public {

        require(bytes(_cid).length > 0, "CID required");
        require(bytes(_fileName).length > 0, "Filename required");

        fileCount++;

        files[fileCount] = File({
            id: fileCount,
            cid: _cid,
            fileName: _fileName,
            owner: msg.sender,
            uploadTime: block.timestamp,
            deleted: false
        });

        userFiles[msg.sender].push(fileCount);

        emit FileUploaded(
            fileCount,
            msg.sender,
            _cid,
            _fileName,
            block.timestamp
        );
    }

    function getFile(uint256 _fileId)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            uint256,
            bool
        )
    {
        File memory file = files[_fileId];

        require(
            file.owner == msg.sender ||
            sharedWith[_fileId][msg.sender],
            "Access denied"
        );

        return (
            file.id,
            file.cid,
            file.fileName,
            file.owner,
            file.uploadTime,
            file.deleted
        );
    }

    function renameFile(
        uint256 _fileId,
        string memory _newName
    )
        public
        onlyOwner(_fileId)
    {
        files[_fileId].fileName = _newName;

        emit FileRenamed(_fileId, _newName);
    }

    function deleteFile(
        uint256 _fileId
    )
        public
        onlyOwner(_fileId)
    {
        files[_fileId].deleted = true;

        emit FileDeleted(_fileId);
    }

    function shareFile(
        uint256 _fileId,
        address _user
    )
        public
        onlyOwner(_fileId)
    {
        sharedWith[_fileId][_user] = true;

        emit FileShared(_fileId, _user);
    }

    function revokeAccess(
        uint256 _fileId,
        address _user
    )
        public
        onlyOwner(_fileId)
    {
        sharedWith[_fileId][_user] = false;

        emit AccessRevoked(_fileId, _user);
    }

    function hasAccess(
        uint256 _fileId,
        address _user
    )
        public
        view
        returns (bool)
    {
        return (
            files[_fileId].owner == _user ||
            sharedWith[_fileId][_user]
        );
    }

    function getMyFiles()
        public
        view
        returns (uint256[] memory)
    {
        return userFiles[msg.sender];
    }

    function getTotalFiles()
        public
        view
        returns (uint256)
    {
        return fileCount;
    }
}