#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QtWidgets>
#include "ui_Mainwindow.h"

class Mainwindow;
class MunuButton : public QPushButton
{
	Q_OBJECT
public:
	MunuButton(Mainwindow* mainwindow, int index, QWidget* parent);
	~MunuButton();
	protected slots:
		void itemClick();
private:
	Mainwindow* m_pMainwindow;
	int m_index;
};

class BaseModal;
class GLWidget;
class Mainwindow : public QMainWindow
{
	Q_OBJECT

public:
	Mainwindow(QWidget *parent = 0);
	~Mainwindow();

	void itemClicked(int index);
	void render();
protected:
	void resizeEvent(QResizeEvent *);

private:
	Ui::MainwindowClass ui;
	GLWidget *m_glWidget;
	QScrollArea* m_scrollArea;
	QWidget* m_scrollChildWidget;
	BaseModal* m_baseModal;
private:
	void initWidget();
	void initBtnItem();

	void triangleClick();

	void createModalObj(int);
};

#endif // MAINWINDOW_H
