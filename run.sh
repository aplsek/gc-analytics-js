#!/bin/sh

usage ()
{
  echo 'Usage : run.sh <RUNID> <GC-log>'
  exit
}

if (( $# != 2)); 
then
  usage
fi



EXPERIMENT=experiments/
RUNID=$1
FILE=$2

INPUT=./input/
LIB=./lib/

#GC_PARSER=$LIB/gc-parser-0.1.0-standalone.jar
GC_PARSER=$LIB/gc-parser-0.1.0.jar
CC=$LIB/gc-parser-0.1.0.jar:$LIB/gc-parser-0.1.0-standalone.jar


OUTPUT=$EXPERIMENT/$RUNID

R_ANALYTICS=./R-analytics
GCPARSER_OUT=$OUTPUT/gc.stats-parser.txt

HTML="gc-list.html"
KEY="<!-- START -->"

# init
CUR_DIR=`pwd`


mkdir -p $EXPERIMENT/$RUNID
cp $FILE $OUTPUT/gc.log




# use gc-parser
echo "Parsing the GC log."
java -classpath $CC -jar $GC_PARSER $FILE $GCPARSER_OUT

cat $GCPARSER_OUT | grep -v "^$" > $GCPARSER_OUT.tmp
rm $GCPARSER_OUT
cp $GCPARSER_OUT.tmp $GCPARSER_OUT
rm $GCPARSER_OUT.tmp



# modify html
C1="<td><a href=\"gc-report.html?expID=$RUNID\">$RUNID</a></td>"
C2="<td>ParOld</td><td>-Xmn=10g</td><td>Hostname 2</td><td>ParlOld experiment test, $FILE</td>"
REP="<tr>$C1$C2</tr>"
sed "s|<\!-- START -->|<\!-- START -->   $REP|g" $HTML > $HTML.tmp
cat $HTML.tmp > $HTML
rm $HTML.tmp






# Run R-Analytics
echo "Running R-Analytics"
cd $R_ANALYTICS && Rscript R/main.R $CUR_DIR/$GCPARSER_OUT $CUR_DIR/$GCPARSER_OUT $RUNID
cd $CUR_DIR

cp $R_ANALYTICS/table.out.txt $OUTPUT/table.main.txt
cp $R_ANALYTICS/table-gctype.out.txt $OUTPUT/table-gctype.txt
cp $R_ANALYTICS/gc.stats.txt $OUTPUT/



echo "Done"
