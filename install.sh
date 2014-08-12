

PARSER_DIR=./gc-parser

PWD=`pwd`

cd $PARSER_DIR && ./build.sh
cd $PWD

cp $PARSER_DIR/target/jar lib/




