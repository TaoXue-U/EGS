#ifndef GENEFFECTFILE_H
#define GENEFFECTFILE_H

#include <QtWidgets/QMainWindow>
#include "ui_geneffectfile.h"

class GenEffectFile : public QMainWindow
{
	Q_OBJECT

public:
	GenEffectFile(QWidget *parent = 0);
	~GenEffectFile();

protected slots:
	void onStart();
	void onOpenDir();
	void onSaveDir();
	void onVersionDir();
protected:
	QStringList getFolderFiles(QString path);
	bool copyFileToPath(QString sourceDir ,QString toDir, bool coverFileIfExist);
private:
	void initWidget();
	QStringList getModal(QString data);
	char* QString2char(QString str);
private:
	Ui::GenEffectFileClass ui;

	QString m_sOpenDirFilename;
	QString m_sSaveDirFIlename;
	QString m_sVersionDirFIlename;
	QStringList m_slFoderFiles;
};

#endif // GENEFFECTFILE_H
