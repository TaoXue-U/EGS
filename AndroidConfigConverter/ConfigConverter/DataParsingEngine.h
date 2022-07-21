#ifndef _DATAPARSINGENGINE_H
#define _DATAPARSINGENGINE_H

#include <map>
using namespace std;

class ConfigParser;
class XmlManager;
class Configconverter;
class XmlNode;
class DataParsingEngine
{
public:
	DataParsingEngine(Configconverter* converter, const char* id, bool isBorderMode = false);
	~DataParsingEngine();

	 void blendModeParserString();

	 void blendParser(const char* ptr, ConfigParser* parser, const char* tpye);
	 void curveParser(const char* ptr, ConfigParser* parser);
	 void adjustParser(const char* ptr, ConfigParser* parser);
	 void lomoWithCurveParser(const char* ptr, ConfigParser* parser);
	 void lomoParser(const char* ptr, ConfigParser* parser);
	 void colorScaleParser(const char* ptr, ConfigParser* parser);
	 void pixblendParser(const char* ptr, ConfigParser* parser);
	 void specialParser(const char* ptr, ConfigParser* parser);
	 void krblendParser(const char* ptr, ConfigParser* parser);
	 void vignetteParser(const char* ptr, ConfigParser* parser);
	 void selfblendParser(const char* ptr, ConfigParser* parser);
	 void colorMulParser(const char* ptr, ConfigParser* parser);
	 void vignetteBlendParser(const char* ptr, ConfigParser* parser);
	 void selectiveColorParser(const char* ptr, ConfigParser* parser);
	 void blendTileParser(const char* ptr, ConfigParser* parser);
	 void borderMParser(const char* ptr, ConfigParser* parser);

	 XmlManager* getXmlManager(){return m_pXmlManager;}
	 void setStepNum(int num){m_iStepNum = num;}

	 void freeNodes(XmlNode* node);
private:
	string getTextureVariablesName(char*& ch);
	char* getSrcDstPic(bool isGetsrc);
	string link(char* ch1, char* ch2);
	void adjustCommonNode(char* nodeName, char* intensityNodeName, char* intensity);
private:
	Configconverter* m_pConverter;

	XmlManager* m_pXmlManager;
	map<string, char*> blendModeStringParser;
	int	m_iTextureNum;
	int m_iStepNum;
	int	m_iStepIndex;
	bool m_bIsConstColorAllocation;
	bool m_bIsCurveAllocation;
};
	

#endif // _DATAPARSINGENGINE_H
