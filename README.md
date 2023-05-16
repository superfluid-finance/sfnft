<h1 align="center">Superfluid NFT API</h1>

## Local development

Install required packages:
`npm i`

Install vercel cli:
`npm i -g vercel`

Run project locally:
`vercel dev`

## NFT API endpoints

### V2

##### Meta
`https://nft.superfluid.finance/cfa/v2/getmeta`

example: `https://nft.superfluid.finance/cfa/v2/getmeta?chain_id=137&token_address=0xa794221d92d77490ff319e95da1461bdf2bd3953&token_symbol=TDLx&token_decimals=18&sender=0x658e1b019f2f30c8089a9ae3ae5820f335bd9ce4&receiver=0x0aff3384ef1299290a052b5b779bf6c231110841&flowRate=3805175038051&start_date=1683534760&outgoing=false`

##### SVG
`https://nft.superfluid.finance/cfa/v2/getsvg`

example: `https://nft.superfluid.finance/cfa/v2/getsvg?chain_id=137&token_address=0xa794221d92d77490ff319e95da1461bdf2bd3953&token_symbol=TDLx&token_decimals=18&sender=0x658e1b019f2f30c8089a9ae3ae5820f335bd9ce4&receiver=0x0aff3384ef1299290a052b5b779bf6c231110841&flowRate=3805175038051&start_date=1683534760&outgoing=false`

### V1

##### Meta
`https://nft.superfluid.finance/cfa/v1/getmeta`

example: `https://nft.superfluid.finance/cfa/v1/getmeta?chain_id=137&token_address=0xa794221d92d77490ff319e95da1461bdf2bd3953&token_symbol=TDLx&token_decimals=18&sender=0x658e1b019f2f30c8089a9ae3ae5820f335bd9ce4&receiver=0x0aff3384ef1299290a052b5b779bf6c231110841&flowRate=3805175038051&start_date=1683534760`

##### SVG
`https://nft.superfluid.finance/cfa/v1/getsvg`

example: `https://nft.superfluid.finance/cfa/v1/getsvg?chain_id=137&token_address=0xa794221d92d77490ff319e95da1461bdf2bd3953&token_symbol=TDLx&token_decimals=18&sender=0x658e1b019f2f30c8089a9ae3ae5820f335bd9ce4&receiver=0x0aff3384ef1299290a052b5b779bf6c231110841&flowRate=3805175038051&start_date=1683534760`


### Query parameters:

`chain_id` - Network ID

Supported networks:
```
5 - Goerli
10 - Optimism
56 - BNB Smart Chain
100 - Gnosis Chain
137 - Polygon
80001 - Polygon Mumbai
42161 - Arbitrum One
43113 - Fuji (C-Chain)
43114 - Avalanche C
```

`token_address` - Super token address

`token_symbol` - Token symbol

`token_decimals` - Refers to how divisible a token can be. (0 - 18)

`sender` - Sender address

`receiver` - Receiver address

`flowRate` - Flow rate

`start_date` - Start date UNIX timestamp

`outgoing` - Boolean to detect if the NFT is for sender or receiver (true|false). This is used only in V2 endpoints.