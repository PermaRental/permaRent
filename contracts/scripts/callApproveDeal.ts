import hre from "hardhat";

async function main() {
    const [lessor, lessee] = await hre.ethers.getSigners();
    console.log(lessor.address, lessee.address);
    const lesseeProof = {
        merkle_root:
            "0x0ec2f2d2fb94e08ccdd7a6f36eb00db8df9ab45e64f3c98d8a4c26f94ab1da9a",
        nullifier_hash:
            "0x2228fb5ea5fa5b47698cabe7fc33ba29eed8cba738d2f191d3c9f00e7cd2328d",
        proof:
            "0x214f7ec6eba9706183da7f201492245aa7b246116a7126d2da210dd01e1910912bc1a6ae9a17cd12609564c50c81228b8c7781d80b9195ab92f530b7e8910efa2b7ed394187cdd1c8b2d4fedb544b715714fdb017a4d6921e4e191fd418cd5b41fc3fece3a10ae3004b8c109b4690b88b716805ebcdfb649cb6de293db3ecd30205180760dd1b01207451d924ffc8e24f0683db0857f0309fa8825585f880b0e270510528099b943739e69714e34af24caf31b9ea9315d25a2fd764cee40b5231c2fd5aa08d4490490d65b3b3cf23a568ecb095dfd5ab6d60361d4c6c0fd033420acee11ab110fcdf1919fbbcb8b61f0424a01fd2ad4eefb647769e1959d7c73",
        verification_level:
            "orb"
    }
    const lessorProof = {
        merkle_root:
            "0x0ec2f2d2fb94e08ccdd7a6f36eb00db8df9ab45e64f3c98d8a4c26f94ab1da9a",
        nullifier_hash:
            "0x03b2802983392757bd8ca8befecdc98b644918732859e62f01dc1e3c247398db",
        proof:
            "0x224b6bf8fbd17d248e063407f5aa6dee5c605b523253329d2fcb848797bc53d02d011555674f0d1fd495860f06c1fe4dec8553deb5208a678bb5c3534aaf4a851e239e137ae3da9314cd14e9690e17e353c0f6a8bd295ac9dce1c8105dfe8b48074a838aae2d66fcbfc4843f21991f79c58cf2b7dbbc290df4ce590f06681f1a1dc9d8e612c2663d4339595df010e53fbb3b719871630f7111ba085c8e04c8c4222771db9a7310361dd1381dad03a00c3e9233cac7fdede2098589574b4736bd141f3ccdf510a105642bb71b969b8de5b8f973e79de763c0a512ab4aebc46eab2e6c7843d18e135218c5e6ad461bbb24c41b99d16e9d234ee5ca357a0bc321de",
        verification_level:
            "orb"
    }
    const dealRentDeal = await hre.ethers.getContractAt("PermaRentDeal", process.env.DEAL_ADDRESS as string);
    const usdc = await hre.ethers.getContractAt("IERC20", process.env.USDC_ADDRESS as string);
    await usdc.connect(lessee).approve(dealRentDeal.target, 10000000000);
    console.log(await dealRentDeal.connect(lessee).signDealAsLessee(lesseeProof.merkle_root, lesseeProof.nullifier_hash, lesseeProof.proof.replace('0x', '').match(/.{1,64}/g).map(a => '0x' + a)));
    console.log(await dealRentDeal.connect(lessor).approveDealForLessee(lessee.address, lessorProof.merkle_root, lessorProof.nullifier_hash, lessorProof.proof.replace('0x', '').match(/.{1,64}/g).map(a => '0x' + a)));
    await dealRentDeal.connect(lessee).setCipherKey({
        cipherKey: "omWPWzl5ectVWthx8S86kb+73rQhyQ5QDCp9UACG74bLEeUXLKAHlakC5LCUTyu7NruPag7BrjchaTlvRSKLRMHcnp7nSVqhYmNBIgbFHHUgFzB2fJSPwmPfG1Cg/bhOmLMLtW+RHO4inKo8GMdRT30C",
        keyHash:"527d3ff80d9dd0191c5f475a2c14ed3aea004718e69dedcfca039bdb1fd6f230"
    })
}

main().catch(console.error);