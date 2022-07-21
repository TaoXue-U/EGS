#include "Configconverter.h"
#include "ConfigParser.h"
#include <QMessageBox>
#include <QFileDialog>
#include <QFile>
#include <string>
#include <iostream>

#include <QDomDocument>  
#include <QDomElement>  
#include <QDomAttr>  
#include <QFile>  

using namespace  std;

Configconverter::Configconverter(QWidget *parent)
	: QMainWindow(parent)
{
	ui.setupUi(this);
	initWidget();
	ui.checkBtn->setVisible(false);
}

Configconverter::~Configconverter()
{

}


void Configconverter::parse( const char *filename )  
{  
    if( NULL == filename )  
        return;  
  
    QFile file( filename );  
    if( !file.open(QFile::ReadOnly | QFile::Text) ) {  
        printf( "open file '%s' failed, error: %s !\n", filename, file.errorString().toStdString().c_str() );  
        return;  
    }  
  
    QDomDocument    document;  
    QString         strError;  
    int             errLin = 0, errCol = 0;  
    if( !document.setContent(&file, false, &strError, &errLin, &errCol) ) {  
        printf( "parse file failed at line %d column %d, error: %s !\n", errLin, errCol, strError );  
        return;  
    }  
  
    if( document.isNull() ) {  
        printf( "document is null !\n" );  
        return;  
    }  
  
    QDomElement root = document.documentElement();  
    printf( "%s ", root.tagName().toStdString().c_str() );  
    if( root.hasAttribute("name") )  
        printf( "%s\n", root.attributeNode("name").value().toStdString().c_str() );  
  
    QDomElement types = root;  
    if( types.isNull() )  
        return;  
    else  
        printf( "\t%s\n", types.tagName().toStdString().c_str() );  
  
    QDomElement element = types.firstChildElement();  
    while( !element.isNull() ) {  
        if( element.hasAttribute("name") )  {
			QString name = element.attributeNode("name").value();
            printf( "type: %s\n", name.toStdString().c_str() ); 
			m_slTypeList.push_back(name);
		}
        element = element.nextSiblingElement();  
    }  

	file.close();
}  
 
QString Configconverter::getCurrentComboxText()
{
	return ui.typeCombox->currentText();
}

void Configconverter::connects()
{
	connect(ui.checkBtn, SIGNAL(clicked()), SLOT(onCheck()));
	connect(ui.convertBtn, SIGNAL(clicked()), SLOT(onConvert()));
	connect(ui.openfileBtn, SIGNAL(clicked()), SLOT(onOpenDir()));
	connect(ui.saveBtn, SIGNAL(clicked()), SLOT(onSaveDir()));
	connect(ui.startBtn, SIGNAL(clicked()), SLOT(onStartConvert()));
	connect(ui.startBorderBtn, SIGNAL(clicked()), SLOT(onStartConvert()));
}

void Configconverter::initWidget()
{
	parse("Type.xml");
	ui.typeCombox->clear();
	ui.typeCombox->addItems(m_slTypeList);
	connects();
}

void Configconverter::onCheck()
{
	QString str = ui.orgConfigText->toPlainText();
	ConfigParser* parser = new ConfigParser();
	if(!parser->setOrgParseString(str.toLocal8Bit(), str.toLocal8Bit()))
	{
		QMessageBox::critical(this, QString::fromLocal8Bit("初始化 filter 失败!"), QString::fromLocal8Bit("规则无效!!"));
	}
}

void Configconverter::onConvert()
{
	QString str = ui.orgConfigText->toPlainText();
	ConfigParser* parser = new ConfigParser(this);
	if(!parser->setOrgParseString(str.toLocal8Bit(), "test.xml"))
	{
		QMessageBox::critical(this, QString::fromLocal8Bit("规则无效!"), QString::fromLocal8Bit("规则无效!!"));
	}	

}

void Configconverter::onOpenDir()
{
	QString dir = QFileDialog::getExistingDirectory(this,  QString::fromLocal8Bit("打开一个文件夹"),
		 QDir::currentPath(),
		QFileDialog::ShowDirsOnly);

	m_sOpenDirFilename = dir;

	m_slFoderFiles = getFolderFiles(dir);
	ui.openDirlineEdit->setText(dir);
}

void Configconverter::onSaveDir()
{
	QString dir = QFileDialog::getExistingDirectory(this,  QString::fromLocal8Bit("打开一个文件夹"),
		 QDir::currentPath(),
		QFileDialog::ShowDirsOnly
		| QFileDialog::DontResolveSymlinks);
	m_sSaveDirFIlename = dir;
	//ui.saveFilenameLabel->setText(dir);
	ui.saveDirLineEdit->setText(dir);
}

void Configconverter::onStartConvert()
{
	QPushButton* btn= qobject_cast<QPushButton*>(sender());  
	if(!m_slFoderFiles.size())
	{
			QMessageBox::critical(this, QString::fromLocal8Bit("空啦"), QString::fromLocal8Bit("该文件夹中没有对应的算法文件！"));
			return;
	}
	printf("start!\n");
	ConfigParser* parser = new ConfigParser(this);
	for (int i=0; i<m_slFoderFiles.size(); i++)
	{
		QString filePathName = m_slFoderFiles[i];
	
		QFileInfo fileinfo = QFileInfo(filePathName);
		QString filename = fileinfo.fileName();
		int lastIndex;
		lastIndex = filename.lastIndexOf(".");
		filename.truncate(lastIndex);
		QString id = filename;
		filename += ".algorithm";

		lastIndex = id.lastIndexOf(".");
		id.truncate(lastIndex);
		lastIndex = id.lastIndexOf(".");
		if(ui.startBorderBtn == btn)
		{
			id.truncate(lastIndex);
			lastIndex = id.lastIndexOf(".");
		}
		id = id.mid(lastIndex+1);

		QString filePath = m_sSaveDirFIlename +"/"+ filename;

		QString filePathTempName = filePathName;
		lastIndex = filePathTempName.lastIndexOf(".");
		filePathTempName.truncate(lastIndex);
		filePathTempName += ".algorithm";

		QFile *file=new QFile(filePathName);
		file->open(QIODevice::ReadOnly|QIODevice::Text);
		QString data = QString(file->readAll());

		printf("start %d ", i);
		if(!parser->setOrgParseString(data.toLocal8Bit(), filePath, id.toLocal8Bit()))
		{
			QMessageBox::critical(this, QString::fromLocal8Bit("初始化 filter 失败!"), QString::fromLocal8Bit("规则无效，无法转换成Android配置文件！"));
			return;
		}
		QString s = fileinfo.fileName();
		string s1 = s.toStdString();
		cout<<"成功转换:"<<s1<<endl;
	}
	
	QMessageBox::information(this, QString::fromLocal8Bit("批量转换成功"), QString::fromLocal8Bit("批量转换成功，请查看相应的结果文件！"));
}

QStringList Configconverter::getFolderFiles(QString path)
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

void Configconverter::setDstNote(QString xml)
{
	ui.dstConfigText->setPlainText(xml);
}

char* Configconverter::QString2char(QString str)
{
	char*  ch;
	QByteArray ba = str.toLatin1();    
	ch=ba.data();
	return ch;
}