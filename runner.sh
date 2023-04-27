#!/bin/bash

RESULTS_DIR="results_$(date "+%Y%m%d%H%M")"
EXECUTIONS=1000

#export NETPLAN_GENERATE_PATH=/path/to/custom/generate
COMMAND="generate"
export G_DEBUG=fatal_criticals

mkdir ${RESULTS_DIR}

iteration=0
while [ $iteration -le $EXECUTIONS ]
do
    node index.js
    OUTPUT=$(netplan ${COMMAND} --root-dir fakeroot 2>&1)
    code=$?
    if [ $code -eq 139 ] || [ $code -eq 245 ]
    then
        dir=${RESULTS_DIR}/crash_$(date "+%Y%m%d%H.%N")
        echo "Saving crash to ${dir}"
        cp -r fakeroot ${dir} 
    fi

    if grep 'detected memory leaks' <<< "$OUTPUT" > /dev/null
    then
        dir=${RESULTS_DIR}/crash_$(date "+%Y%m%d%H.%N")
        echo "Saving memory leak to ${dir}"
        cp -r fakeroot ${dir} 
    fi

    echo "${OUTPUT}" >> "${RESULTS_DIR}".log

    iteration=$((iteration + 1))
done
