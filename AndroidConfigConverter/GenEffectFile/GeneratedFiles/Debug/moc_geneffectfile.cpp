/****************************************************************************
** Meta object code from reading C++ file 'geneffectfile.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.2.1)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../../geneffectfile.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'geneffectfile.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.2.1. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
struct qt_meta_stringdata_GenEffectFile_t {
    QByteArrayData data[6];
    char stringdata[57];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    offsetof(qt_meta_stringdata_GenEffectFile_t, stringdata) + ofs \
        - idx * sizeof(QByteArrayData) \
    )
static const qt_meta_stringdata_GenEffectFile_t qt_meta_stringdata_GenEffectFile = {
    {
QT_MOC_LITERAL(0, 0, 13),
QT_MOC_LITERAL(1, 14, 7),
QT_MOC_LITERAL(2, 22, 0),
QT_MOC_LITERAL(3, 23, 9),
QT_MOC_LITERAL(4, 33, 9),
QT_MOC_LITERAL(5, 43, 12)
    },
    "GenEffectFile\0onStart\0\0onOpenDir\0"
    "onSaveDir\0onVersionDir\0"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_GenEffectFile[] = {

 // content:
       7,       // revision
       0,       // classname
       0,    0, // classinfo
       4,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    0,   34,    2, 0x09,
       3,    0,   35,    2, 0x09,
       4,    0,   36,    2, 0x09,
       5,    0,   37,    2, 0x09,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,

       0        // eod
};

void GenEffectFile::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        GenEffectFile *_t = static_cast<GenEffectFile *>(_o);
        switch (_id) {
        case 0: _t->onStart(); break;
        case 1: _t->onOpenDir(); break;
        case 2: _t->onSaveDir(); break;
        case 3: _t->onVersionDir(); break;
        default: ;
        }
    }
    Q_UNUSED(_a);
}

const QMetaObject GenEffectFile::staticMetaObject = {
    { &QMainWindow::staticMetaObject, qt_meta_stringdata_GenEffectFile.data,
      qt_meta_data_GenEffectFile,  qt_static_metacall, 0, 0}
};


const QMetaObject *GenEffectFile::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *GenEffectFile::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_GenEffectFile.stringdata))
        return static_cast<void*>(const_cast< GenEffectFile*>(this));
    return QMainWindow::qt_metacast(_clname);
}

int GenEffectFile::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QMainWindow::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 4)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 4;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 4)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 4;
    }
    return _id;
}
QT_END_MOC_NAMESPACE
