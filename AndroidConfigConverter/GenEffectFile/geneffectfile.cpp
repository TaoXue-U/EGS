#include "geneffectfile.h"
#include <QMessageBox>
#include <QFileDialog>
#include <QFile>
#include <QDebug>
#include <QTextStream>
#include <iostream>
using namespace std;

GenEffectFile::GenEffectFile(QWidget *parent)
	: QMainWindow(parent)
{
	ui.setupUi(this);

	initWidget();
}

GenEffectFile::~GenEffectFile()
{

}

void GenEffectFile::onOpenDir()
{
	QString dir = QFileDialog::getExistingDirectory(this,  QString::fromLocal8Bit("打开一个文件夹"),
		QDir::currentPath(),
		QFileDialog::ShowDirsOnly);

	m_sOpenDirFilename = dir;
	m_slFoderFiles = getFolderFiles(dir);
	ui.openDirlineEdit->setText(dir);
}

void GenEffectFile::onSaveDir()
{
	QString dir = QFileDialog::getExistingDirectory(this,  QString::fromLocal8Bit("打开一个文件夹"),
		QDir::currentPath(),
		QFileDialog::ShowDirsOnly
		| QFileDialog::DontResolveSymlinks);
	m_sSaveDirFIlename = dir;
	ui.saveDirLineEdit->setText(dir);
}

void GenEffectFile::onVersionDir()
{
	QString dir = QFileDialog::getExistingDirectory(this,  QString::fromLocal8Bit("打开一个文件夹"),
		QDir::currentPath(),
		QFileDialog::ShowDirsOnly
		| QFileDialog::DontResolveSymlinks);
	m_sVersionDirFIlename = dir;
	ui.versionedit->setText(dir);
}

void GenEffectFile::onStart()
{
	if(!m_slFoderFiles.size())
	{
		QMessageBox::critical(this, QString::fromLocal8Bit("空啦"), QString::fromLocal8Bit("该文件夹中没有对应的算法文件！"));
		return;
	}

	for (int i=0; i<m_slFoderFiles.size(); i++)
	{
		QString filePathName = m_slFoderFiles[i];

		QFileInfo fileinfo = QFileInfo(filePathName);
		QString filename = fileinfo.fileName();
		QString filenametmp = filename;
		int index = filename.lastIndexOf(".");
		filename.truncate(index);

		QDir *createfile = new QDir;
		createfile->mkpath(m_sSaveDirFIlename + "/" + filename);
		createfile->mkpath(m_sSaveDirFIlename + "/" + filename + "_s");

		QFile *file=new QFile(filePathName);
		file->open(QIODevice::ReadOnly|QIODevice::Text);
		QString data = QString(file->readAll());

		copyFileToPath(filePathName, m_sSaveDirFIlename + "/" + filename +"/" +filenametmp , true);

		copyFileToPath(m_sVersionDirFIlename + "/effectVersion.xml", m_sSaveDirFIlename + "/" + filename +"/effectVersion.xml" , true);
		copyFileToPath(m_sVersionDirFIlename + "/effectVersion.xml", m_sSaveDirFIlename + "/" + filename + "_s" + "/effectVersion.xml" , true);
		
		QStringList list  =  getModal(data);
		
		for (int j=0; j<list.size(); j++)
		{
			QString str = list[j];
			QString str1 = str;
			int lastIndex = str.lastIndexOf(".");
			QString tmp = str.mid(lastIndex + 1);

			if(QString::compare(tmp, QString("jpg"), Qt::CaseInsensitive) == 0)   
			{
				//printf("success\n");
				data.replace(str,"s_" + str);
				copyFileToPath(m_sOpenDirFilename +"/" +  str, m_sSaveDirFIlename + "/" + filename +"/" +str , true);
				copyFileToPath(m_sOpenDirFilename +"/" +  "s_" + str, m_sSaveDirFIlename + "/" + filename + "_s" + "/" + "s_" + str , true);
			}
		}

		QFile f(m_sSaveDirFIlename + "/" + filename + "_s" + "/" + filenametmp);  
		if(!f.open(QIODevice::WriteOnly | QIODevice::Text))  
		{  
			return;  
		}  

		QTextStream txtOutput(&f);  

		txtOutput << data << endl;  

		f.close();   

		cout<<"成功打包算法配置文件："<<filenametmp.toStdString() <<endl;
	}
	cout<<endl;
	QMessageBox::critical(this, QString::fromLocal8Bit("打包成功"), QString::fromLocal8Bit("打包成功！"));
}

QStringList GenEffectFile::getModal(QString data)
{
	QStringList list;

	QRegExp rx("(\\S+)");
	int pos = 0;

	while ((pos = rx.indexIn(data, pos)) != -1) {
		list << rx.cap(1);
		pos += rx.matchedLength();
	}

	return list;
}

void GenEffectFile::initWidget()
{
	connect(ui.startBtn, SIGNAL(clicked()), SLOT(onStart()));
	connect(ui.openfileBtn, SIGNAL(clicked()), SLOT(onOpenDir()));
	connect(ui.saveBtn, SIGNAL(clicked()), SLOT(onSaveDir()));
	connect(ui.versionBtn, SIGNAL(clicked()), SLOT(onVersionDir()));
}

QStringList GenEffectFile::getFolderFiles(QString path)
{
	//判断路径是否存在
	QStringList string_list;

	QDir dir(path);
	if(!dir.exists())
	{
		return string_list;
	}
	dir.setFilter(QDir::Files | QDir::NoSymLinks);
	QFileInfoList list = dir.entryInfoList();

	int file_count = list.count();
	if(file_count <= 0)
	{
		return string_list;
	}

	for(int i=0; i<file_count; i++)
	{
		QFileInfo file_info = list.at(i);
		QString suffix = file_info.suffix();
		if(QString::compare(suffix, QString("algorithm"), Qt::CaseInsensitive) == 0)   
		{   
			QString absolute_file_path = file_info.absoluteFilePath();
			string_list.append(absolute_file_path);
		}
	}
	return string_list;
}

char* GenEffectFile::QString2char(QString str)
{
	char*  ch;
	QByteArray ba = str.toLatin1();    
	ch=ba.data();
	return ch;
}

bool GenEffectFile::copyFileToPath(QString sourceDir ,QString toDir, bool coverFileIfExist)
{
	toDir.replace("\\","/");
	if (sourceDir == toDir){
		return true;
	}
	if (!QFile::exists(sourceDir)){
		return false;
	}
	QDir *createfile     = new QDir;
	bool exist = createfile->exists(toDir);
	if (exist){
		if(coverFileIfExist){
			createfile->remove(toDir);
		}
	}//end if

	if(!QFile::copy(sourceDir, toDir))
	{
		return false;
	}
	return true;
}
