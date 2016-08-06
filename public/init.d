#!/bin/bash
### BEGIN INIT INFO
# Provides:          ireg #CHANGEME Use your own app name
# Required-Start:    $local_fs $remote_fs $network $syslog $named
# Required-Stop:     $local_fs $remote_fs $network $syslog $named
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start/stop my node application #CHANGEME Use your own description
### END INIT INFO

#CHANGEME Add any exports/environment variables here

NAME=ireg #CHANGEME Use your own app name
SOURCE_DIR=/ireg #CHANGEME Set this to the base directory of your node application
SOURCE_FILE=server.js #CHANGEME This is the 'index' js file that node should be set to run to start your application

user=root #CHANGEME Run the application as this user
pidfile=/var/run/$NAME.pid
forever_dir=/var/run/forever

node=node
forever=/usr/local/lib/node_modules/forever/bin/forever
sed=sed

export PATH=$PATH:/home/node/local/node/bin
export NODE_PATH=$NODE_PATH:/home/node/local/node/lib/node_modules

start() {
  echo "Starting $NAME node instance: "

  if [ "$foreverid" == "" ]; then
    # Create the pid file, making sure that
    # the target use has access to them
    touch $pidfile
    chown $user $pidfile

    # Launch the application
    pushd $SOURCE_DIR > /dev/null
    sudo -u $user $forever start -d -p $forever_dir --pidFile $pidfile -a $SOURCE_FILE
    echo "sudo -u $user $forever start -d -p $forever_dir --pidFile $pidfile -a $SOURCE_FILE"
    RETVAL=$?
  else
    echo "Instance already running"
    RETVAL=0
  fi
}

stop() {
  echo -n "Shutting down $NAME node instance : "
  if [ "$foreverid" != "" ]; then
    $node $SOURCE_DIR/prepareForStop.js
    $forever stop -p $forever_dir $foreverid
  else
    echo "Instance is not running";
  fi
  RETVAL=$?
}

status() {
	VAL=`(cat ${pidfile} | xargs ps -p) | wc -l`
	if [[ "$VAL" == "2" ]]; then
		INFO=`sudo -u $user $forever list --plain | $sed -n 's/^data:\s\+\[\([0-9]\+\)\]\s\+.*\s\+'$pid'\s\+\S\+\s\+\([0-9]\+:[0-9]\+:[0-9]\+:[0-9]\+\.[0-9]\+\)\s*$/Fid \1 Uptime \2/p'`
		echo "Running ($INFO)"
		RETVAL=0
	else
		echo "Not running"
		RETVAL=-1
	fi
}

if [ -f $pidfile ]; then
  read pid < $pidfile
else
  pid=""
fi

if [ "$pid" != "" ]; then
  # Gnarly sed usage to obtain the foreverid.
  foreverid=`sudo -u $user $forever list --plain | $sed -n 's/^data:\s\+\[\([0-9]\+\)\]\s\+.*\s\+'$pid'\s\+\S\+\s\+[0-9]\+:[0-9]\+:[0-9]\+:[0-9]\+\.[0-9]\+\s*$/\1/p'`
else
  foreverid=""
fi

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  status)
    status
    ;;
  *)
    echo "Usage:  {start|stop|status}"
    exit 1
    ;;
esac
exit $RETVAL
