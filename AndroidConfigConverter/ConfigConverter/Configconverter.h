#ifndef CONFIGCONVERTER_H
#define CONFIGCONVERTER_H

#include <QtWidgets/QMainWindow>
#include "ui_Configconverter.h"


class Configconverter : public QMainWindow
{
	Q_OBJECT

public:
	Configconverter(QWidget *parent = 0);
	~Configconverter();

	void initWidget();
	void connects();

    void setDstNote(QString xml);
	void parse( const char *filename ) ; 
	QString getCurrentComboxText();

protected slots:
	void onCheck();
	void onConvert();
	void onOpenDir();
	void onSaveDir();
	void onStartConvert();
protected:
	QStringList getFolderFiles(QString path);
	char* QString2char(QString str);

private:
	Ui::ConfigconverterClass ui;

	QString m_sOpenDirFilename;
	QString m_sSaveDirFIlename;
	QStringList m_slFoderFiles;
	QStringList m_slTypeList;
};

#endif // CONFIGCONVERTER_H
