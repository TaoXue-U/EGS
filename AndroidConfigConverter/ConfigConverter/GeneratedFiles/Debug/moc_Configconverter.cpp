/****************************************************************************
** Meta object code from reading C++ file 'Configconverter.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.2.1)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "../../Configconverter.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'Configconverter.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.2.1. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
struct qt_meta_stringdata_Configconverter_t {
    QByteArrayData data[7];
    char stringdata[71];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    offsetof(qt_meta_stringdata_Configconverter_t, stringdata) + ofs \
        - idx * sizeof(QByteArrayData) \
    )
static const qt_meta_stringdata_Configconverter_t qt_meta_stringdata_Configconverter = {
    {
QT_MOC_LITERAL(0, 0, 15),
QT_MOC_LITERAL(1, 16, 7),
QT_MOC_LITERAL(2, 24, 0),
QT_MOC_LITERAL(3, 25, 9),
QT_MOC_LITERAL(4, 35, 9),
QT_MOC_LITERAL(5, 45, 9),
QT_MOC_LITERAL(6, 55, 14)
    },
    "Configconverter\0onCheck\0\0onConvert\0"
    "onOpenDir\0onSaveDir\0onStartConvert\0"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_Configconverter[] = {

 // content:
       7,       // revision
       0,       // classname
       0,    0, // classinfo
       5,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    0,   39,    2, 0x09,
       3,    0,   40,    2, 0x09,
       4,    0,   41,    2, 0x09,
       5,    0,   42,    2, 0x09,
       6,    0,   43,    2, 0x09,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,

       0        // eod
};

void Configconverter::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        Configconverter *_t = static_cast<Configconverter *>(_o);
        switch (_id) {
        case 0: _t->onCheck(); break;
        case 1: _t->onConvert(); break;
        case 2: _t->onOpenDir(); break;
        case 3: _t->onSaveDir(); break;
        case 4: _t->onStartConvert(); break;
        default: ;
        }
    }
    Q_UNUSED(_a);
}

const QMetaObject Configconverter::staticMetaObject = {
    { &QMainWindow::staticMetaObject, qt_meta_stringdata_Configconverter.data,
      qt_meta_data_Configconverter,  qt_static_metacall, 0, 0}
};


const QMetaObject *Configconverter::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *Configconverter::qt_metacast(const char *_clname)
{
    if (!_clname) return 0;
    if (!strcmp(_clname, qt_meta_stringdata_Configconverter.stringdata))
        return static_cast<void*>(const_cast< Configconverter*>(this));
    return QMainWindow::qt_metacast(_clname);
}

int Configconverter::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QMainWindow::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 5)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 5;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 5)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 5;
    }
    return _id;
}
QT_END_MOC_NAMESPACE
