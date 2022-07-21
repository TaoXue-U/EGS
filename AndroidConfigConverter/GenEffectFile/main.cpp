#include "geneffectfile.h"
#include <QtWidgets/QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	GenEffectFile w;
	w.show();
	return a.exec();
}
