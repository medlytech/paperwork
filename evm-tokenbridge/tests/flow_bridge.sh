node flow.js evm0 deploy
node flow.js evm1 deploy
node flow.js evm0 register_chain evm1
node flow.js evm1 register_chain evm0

node flow.js evm0 get_tokens 100
node flow.js evm0 attest_token evm1
node flow.js evm1 get_token_counts
node flow.js evm0 bridge_token evm1 50
node flow.js evm0 get_token_counts
node flow.js evm1 get_token_counts