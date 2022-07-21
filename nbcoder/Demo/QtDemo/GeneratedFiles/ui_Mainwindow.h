/********************************************************************************
** Form generated from reading UI file 'Mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.2.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainwindowClass
{
public:
    QWidget *centralWidget;
    QWidget *sceneWidget;
    QWidget *menuWidget;
    QMenuBar *menuBar;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *MainwindowClass)
    {
        if (MainwindowClass->objectName().isEmpty())
            MainwindowClass->setObjectName(QStringLiteral("MainwindowClass"));
        MainwindowClass->resize(1044, 713);
        centralWidget = new QWidget(MainwindowClass);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        sceneWidget = new QWidget(centralWidget);
        sceneWidget->setObjectName(QStringLiteral("sceneWidget"));
        sceneWidget->setGeometry(QRect(250, 70, 641, 591));
        sceneWidget->setStyleSheet(QStringLiteral("background-color: #0a0"));
        menuWidget = new QWidget(centralWidget);
        menuWidget->setObjectName(QStringLiteral("menuWidget"));
        menuWidget->setGeometry(QRect(30, 150, 171, 421));
        menuWidget->setStyleSheet(QStringLiteral(""));
        MainwindowClass->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(MainwindowClass);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 1044, 23));
        MainwindowClass->setMenuBar(menuBar);
        mainToolBar = new QToolBar(MainwindowClass);
        mainToolBar->setObjectName(QStringLiteral("mainToolBar"));
        MainwindowClass->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(MainwindowClass);
        statusBar->setObjectName(QStringLiteral("statusBar"));
        MainwindowClass->setStatusBar(statusBar);

        retranslateUi(MainwindowClass);

        QMetaObject::connectSlotsByName(MainwindowClass);
    } // setupUi

    void retranslateUi(QMainWindow *MainwindowClass)
    {
        MainwindowClass->setWindowTitle(QApplication::translate("MainwindowClass", "Mainwindow", 0));
    } // retranslateUi

};

namespace Ui {
    class MainwindowClass: public Ui_MainwindowClass {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
