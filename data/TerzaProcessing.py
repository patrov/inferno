# -*- coding: utf-8 -*-

from textblob import TextBlob
from nltk.tokenize import BlanklineTokenizer
from pprint import pprint
from codecs import open
from app import APP_ROOT
from app.main.Models import Terza, db

chantToken = u'CHANT'
availableLang = [('en', 'Canto'), ('fr', chantToken), ('it', 'Canto'),]

def populate_canto():
	for infos in iter(availableLang):
		
		#load fr only
		if infos[0] != 'fr':
			continue
			
		cantoFile = open(APP_ROOT + '\\data\\ressources\\%s\\Inferno-complete.txt' % infos[0] ,'r','utf-8') 
		tokenizer = BlanklineTokenizer()
		canto = TextBlob(cantoFile.read()) 
		#user blank
		canto = canto.tokenize(tokenizer)
		terzaNo = 1
		cantoNo = 0
		for terza in canto:
			if terza.find(infos[1]) != -1 :
				cantoNo = cantoNo + 1				
				print "cantoNo {0}".format(cantoNo)
				print terza.encode("utf-8").find("CHANT")
				continue
			else:
				
				terza_item = Terza(terzaNo, terza, cantoNo, infos[0])
				print "Canto {0}, Terza {1}".format(cantoNo, terzaNo)
				terzaNo = terzaNo + 1
				db.session.add(terza_item)   
			db.session.commit()
			
		print '{0} stranza ajoutés à la base Inferno'.format(terzaNo)

if __name__ == "__main__":
	print "Populate canto ... "
	populate_canto()
	print "Done!"