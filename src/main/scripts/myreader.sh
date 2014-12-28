#!/bin/bash
#-----------------------------------------------------
# myreader
#-----------------------------------------------------
# Script for running myreader as a service under initd.
#
# Usage: service myreader {start|stop|restart|status}"
#
# Author: Kamill Sokol <dev@sokol-web.de>
#-----------------------------------------------------
### BEGIN INIT INFO
# Provides: myreader
# Required-Start:
# Required-Stop:
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 2 6
# Short-Description: init script for myreader
# Description: init script for myreader
# This should be placed in /etc/init.d
### END INIT INFO

MYREADER_NAME=myreader
MYREADER_HOME=/opt/myreader
MYREADER_CONF=${MYREADER_HOME}/config/application.properties
MYREADER_USER=myreader
MYREADER_PORT=9340

if [ ! -e /etc/redhat-release ]; then
    echo "This is built for RHEL/Fedora/CentOS, you may need to alter it to fit your distribution"
    exit 1
fi
:
if [ -f ${MYREADER_CONF} ]; then
    TMP=$(egrep -o "server.port=.*" ${MYREADER_HOME}/config/application.properties | cut -b 13-19)
    if [ ! -z ${TMP} ]; then
        MYREADER_PORT=${TMP}
    fi
fi

. /etc/rc.d/init.d/functions

case $1 in
start)
    PID=$(lsof -i:${MYREADER_PORT} -a -u ${MYREADER_USER} -t)

    if [ ${PID} ]; then
        echo "Already running ${MYREADER_NAME}" && warning
        echo
        exit 1
    fi

    action "Starting ${MYREADER_NAME}: " daemon --check myreader --user ${MYREADER_USER} "cd ${MYREADER_HOME}; nohup java -server -jar myreader.jar > ${MYREADER_HOME}/logs/nohup.out 2>&1 &"
    echo
;;
stop)
    PID=$(lsof -i:${MYREADER_PORT} -a -u ${MYREADER_USER} -t)

    if [ ${PID} ]; then
        action "Shutting down ${NAME}: " kill ${PID}
    else
        echo -n "Service ${MYREADER_NAME} not running!" && failure
        echo
    fi

    echo
;;
restart)
    $0 stop
    $0 start
;;
status)
    PID=$(lsof -i:${MYREADER_PORT} -a -u ${MYREADER_USER} -t)

    if [ ${PID} ]; then
        echo "${MYREADER_NAME} running PID: ${PID}"
    else
        echo "${MYREADER_NAME} not running"
    fi
;;
*)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 3
;;
esac