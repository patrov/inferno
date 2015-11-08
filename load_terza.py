from data.TerzaProcessing import populate_canto, db


if __name__ == "__main__":
	db.drop_all()
	db.create_all()
	populate_canto()