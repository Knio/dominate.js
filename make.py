#!/usr/bin/env python

import os
import sys
import shutil
import subprocess

from datetime import datetime
from build import version, order

# Relevant directory paths
dir_repo  = os.path.dirname(os.path.realpath(__file__))
dir_src   = os.path.join(dir_repo, 'src')
dir_build = os.path.join(dir_repo, 'build')
dir_bin   = os.path.join(dir_build, 'bin')
dir_dist  = os.path.join(dir_repo, 'dist')
dir_test  = os.path.join(dir_repo, 'test')

# Setup distribution file names
name_lib = 'pyy-' + version
name_out = name_lib + '.js'
name_min = name_lib + '.min.js'

# Setup distribution file paths
file_out  = os.path.join(dir_dist, name_out)
file_min  = os.path.join(dir_dist, name_min)
file_head = os.path.join(dir_build, 'header.js')

print('Building ' + name_lib + '...')

shutil.rmtree(dir_dist)
os.mkdir(dir_dist)

# Read header file
header = None
with open(file_head, 'r') as f:
    header = f.read().strip()
if header is None:
    print('ERROR: Could not read header file.')
    sys.exit(1)

# Replace variables in header
now = datetime.now()
header = header.replace('$VERSION$', version)
header = header.replace('$YEAR$', str(now.year))
header = header.replace('$DATE$', str(now.strftime('%Y-%m-%d %H:%M:%S')))

# Check each source file via lint while aggregating their contents
fail = False
data = ''
for name_src in order:
    file_src = os.path.join(dir_src, name_src)
    try:
        subprocess.check_call(['gjslint', '--strict', file_src])
    except subprocess.CalledProcessError:
        fail = True
        continue
    with open(file_src, 'r') as f:
        data += '\n\n' + f.read().strip()
if fail:
    print('\nAborting build.')
    sys.exit(1)

# Write uncompressed output file
data_out = header + data
with open(file_out, 'w') as f:
    f.write(data_out)

# TODO Run test suite

# Compress with closure compiler
data_min = header
cmd = ['java', '-jar', 'closure-compiler-20110811.jar']
try:
    closure = subprocess.Popen(cmd,
        cwd=dir_bin,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
    )
    data_min += closure.communicate(data_out)[0]
except subprocess.CalledProcessError:
    print('\nAborting build.')
    sys.exit(1)
with open(file_min, 'w') as f:
    f.write(data_min)
