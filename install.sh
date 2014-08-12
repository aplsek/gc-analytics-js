
mkdir -p lib
PARSER_DIR=./gc-parser

PP=`pwd`

cd $PARSER_DIR && ./build.sh
cd $PP && cp $PARSER_DIR/target/gc-parser* lib/




