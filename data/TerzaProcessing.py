# -*- coding: utf-8 -*-

from textblob import TextBlob
from nltk.tokenize import BlanklineTokenizer
from pprint import pprint
from codecs import open
from models.Models import *

cantoFile = open('ressources\it\Inferno-complete.txt','r','utf-8') 
tokenizer = BlanklineTokenizer()
canto = TextBlob(cantoFile.read()) 
#user blank
canto = canto.tokenize(tokenizer)
terzaNo = 1
cantoNo = 0
for terza in canto:
    if terza.find("Inferno") != -1 :
        cantoNo = cantoNo + 1
        continue
    else:
        terza = Terza(cantoNo, terza, 'it')
        print "Canto {0}".format(cantoNo)
        terza.setNo(terzaNo)
        terzaNo = terzaNo + 1
        db.session.add(terza)    
    db.session.commit()
    
print '{0} stranza ajoutés à la base Inferno'.format(terza)
