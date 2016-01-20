#!/usr/bin/env bash
publish_path=${PWD##*/}
rsync --recursive --itemize-changes --compress --exclude=.git . aelv:~/public_html/$publish_path
echo -n "http://aelv.se/pontus/$publish_path" | pbcopy