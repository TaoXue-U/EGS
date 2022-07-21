#include "Configconverter.h"
#include <QtWidgets/QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	Configconverter w;
	w.show();
	w.setWindowTitle(QString::fromLocal8Bit("Android特效转换工具 V1.0"));
	return a.exec();
}
